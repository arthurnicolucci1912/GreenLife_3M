using Microsoft.AspNetCore.Mvc;
using System.Data.SqlClient;
using System.Collections.Generic;

namespace GL_API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PlantioController : ControllerBase
    {
        private readonly ILogger<PlantioController> _logger;

        // Corrigido o ConnectionString
        private const string ConnectionString = "Data Source=(localdb)\\MSSQLLocalDB;Initial Catalog=GL_BD;Integrated Security=True;Connect Timeout=30;Encrypt=False;TrustServerCertificate=False;";

        public PlantioController(ILogger<PlantioController> logger)
        {
            _logger = logger;
        }

        private int GetUserIdByEmail(string email)
        {
            int userId = -1; // Valor padrão caso o usuário não seja encontrado

            using (var connection = new SqlConnection(ConnectionString))
            {
                var query = "SELECT Id FROM Cadastro WHERE Email = @Email";
                using (var command = new SqlCommand(query, connection))
                {
                    command.Parameters.AddWithValue("@Email", email);
                    connection.Open();
                    userId = (int?)command.ExecuteScalar() ?? -1; // Se não encontrado, mantém -1
                }
            }

            return userId;
        }

        [HttpGet(Name = "GetPlantio")]
        public ActionResult<IEnumerable<Plantio>> Get([FromQuery] string email)
        {
            var plantios = new List<Plantio>();
            int usuarioId = GetUserIdByEmail(email);

            // Se o usuário não existir, retornar um 404 ou outra resposta apropriada
            if (usuarioId == -1)
            {
                return NotFound("Usuário não encontrado.");
            }

            // Obter os plantios do usuário
            using (var connection = new SqlConnection(ConnectionString))
            {
                var query = "SELECT * FROM Plantio WHERE CadastroId = @CadastroId";
                using (var command = new SqlCommand(query, connection))
                {
                    command.Parameters.AddWithValue("@CadastroId", usuarioId);
                    connection.Open();
                    using (var reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            var plantio = new Plantio()
                            {
                                Id = Convert.ToInt32(reader["Id"]),
                                NomePlantio = reader["NomePlantio"].ToString(),
                                DataPlantio = Convert.ToDateTime(reader["DataPlantio"]),
                                Tipo = reader["Tipo"].ToString(),
                                Semente = reader["Semente"].ToString(),
                                Local = reader["Local"].ToString(),
                                DataColheita = Convert.ToDateTime(reader["DataColheita"])
                            };
                            plantios.Add(plantio);
                        }
                    }
                }
            }

            return Ok(plantios);
        }

        [HttpGet("{id}", Name = "GetPlantioById")]
        public ActionResult<Plantio> GetPlantioById(int id, [FromQuery] string email)
        {
            if (string.IsNullOrEmpty(email))
            {
                return BadRequest("Email não fornecido.");
            }

            // Obter o Id do usuário com base no email fornecido
            int usuarioId = GetUserIdByEmail(email);
            if (usuarioId == -1)
            {
                return NotFound("Usuário não encontrado.");
            }

            using (var connection = new SqlConnection(ConnectionString))
            {
                var query = "SELECT * FROM Plantio WHERE Id = @Id AND CadastroId = @CadastroId";
                using (var command = new SqlCommand(query, connection))
                {
                    command.Parameters.AddWithValue("@Id", id);
                    command.Parameters.AddWithValue("@CadastroId", usuarioId);
                    connection.Open();
                    using (var reader = command.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            var plantio = new Plantio()
                            {
                                Id = Convert.ToInt32(reader["Id"]),
                                NomePlantio = reader["NomePlantio"].ToString(),
                                DataPlantio = Convert.ToDateTime(reader["DataPlantio"]),
                                Tipo = reader["Tipo"].ToString(),
                                Semente = reader["Semente"].ToString(),
                                Local = reader["Local"].ToString(),
                                DataColheita = Convert.ToDateTime(reader["DataColheita"])
                            };

                            return Ok(plantio);
                        }
                    }
                }
            }
            return NotFound("Plantio não encontrado ou não pertence ao usuário.");
        }


        [HttpPost]
        public ActionResult CreatePlantio([FromBody] Plantio plantio, [FromQuery] string email)
        {
            if (string.IsNullOrEmpty(email))
            {
                return BadRequest(new { message = "Email do usuário não fornecido." });
            }

            // Obter o Id do usuário com base no email
            int usuarioId = GetUserIdByEmail(email);
            if (usuarioId == -1)
            {
                return NotFound(new { message = "Usuário não encontrado." });
            }

            using (var connection = new SqlConnection(ConnectionString))
            {
                var query = "INSERT INTO Plantio (NomePlantio, DataPlantio, Tipo, Semente, Local, DataColheita, CadastroId) VALUES (@NomePlantio, @DataPlantio, @Tipo, @Semente, @Local, @DataColheita, @CadastroId)";
                using (var command = new SqlCommand(query, connection))
                {
                    command.Parameters.AddWithValue("@NomePlantio", plantio.NomePlantio);
                    command.Parameters.AddWithValue("@DataPlantio", plantio.DataPlantio);
                    command.Parameters.AddWithValue("@Tipo", plantio.Tipo);
                    command.Parameters.AddWithValue("@Semente", plantio.Semente);
                    command.Parameters.AddWithValue("@Local", plantio.Local);
                    command.Parameters.AddWithValue("@DataColheita", plantio.DataColheita);
                    command.Parameters.AddWithValue("@CadastroId", usuarioId); // Adicionando o ID do usuário como chave estrangeira

                    connection.Open();
                    var rowsAffected = command.ExecuteNonQuery();

                    if (rowsAffected > 0)
                    {
                        // Retornar um objeto JSON com a mensagem de sucesso
                        return CreatedAtAction(nameof(GetPlantioById), new { id = plantio.Id }, new { message = "Plantio criado com sucesso." });
                    }
                }
            }

            return BadRequest(new { message = "Erro ao criar o plantio." });
        }

        [HttpPut("{id}")]
        public ActionResult UpdatePlantio(int id, [FromBody] Plantio plantio, [FromQuery] string email)
        {
            if (string.IsNullOrEmpty(email))
            {
                return BadRequest("Email do usuário não fornecido.");
            }

            // Obter o Id do usuário com base no email
            int usuarioId = GetUserIdByEmail(email);
            if (usuarioId == -1)
            {
                return NotFound("Usuário não encontrado.");
            }

            using (var connection = new SqlConnection(ConnectionString))
            {
                // Verificar se o plantio pertence ao usuário
                var checkQuery = "SELECT COUNT(*) FROM Plantio WHERE Id = @Id AND CadastroId = @CadastroId";
                using (var checkCommand = new SqlCommand(checkQuery, connection))
                {
                    checkCommand.Parameters.AddWithValue("@Id", id);
                    checkCommand.Parameters.AddWithValue("@CadastroId", usuarioId);
                    connection.Open();

                    var exists = (int)checkCommand.ExecuteScalar();
                    if (exists == 0)
                    {
                        return Forbid("Você não tem permissão para atualizar este plantio.");
                    }
                }

                // Se o plantio pertence ao usuário, prosseguir com a atualização
                var query = "UPDATE Plantio SET NomePlantio = @NomePlantio, DataPlantio = @DataPlantio, Tipo = @Tipo, Semente = @Semente, Local = @Local, DataColheita = @DataColheita WHERE Id = @Id";
                using (var command = new SqlCommand(query, connection))
                {
                    command.Parameters.AddWithValue("@NomePlantio", plantio.NomePlantio);
                    command.Parameters.AddWithValue("@DataPlantio", plantio.DataPlantio);
                    command.Parameters.AddWithValue("@Tipo", plantio.Tipo);
                    command.Parameters.AddWithValue("@Semente", plantio.Semente);
                    command.Parameters.AddWithValue("@Local", plantio.Local);
                    command.Parameters.AddWithValue("@DataColheita", plantio.DataColheita);
                    command.Parameters.AddWithValue("@Id", id);

                    var rowsAffected = command.ExecuteNonQuery();

                    if (rowsAffected > 0)
                    {
                        return Ok(plantio);
                    }
                }
            }

            return NotFound("Plantio não encontrado.");
        }


        [HttpDelete("{id}")]
        public ActionResult DeletePlantio(int id, [FromQuery] string email)
        {
            if (string.IsNullOrEmpty(email))
            {
                return BadRequest("Email do usuário não fornecido.");
            }

            // Obter o Id do usuário com base no email
            int usuarioId = GetUserIdByEmail(email);
            if (usuarioId == -1)
            {
                return NotFound("Usuário não encontrado.");
            }

            using (var connection = new SqlConnection(ConnectionString))
            {
                // Verificar se o plantio pertence ao usuário
                var checkQuery = "SELECT COUNT(*) FROM Plantio WHERE Id = @Id AND CadastroId = @CadastroId";
                using (var checkCommand = new SqlCommand(checkQuery, connection))
                {
                    checkCommand.Parameters.AddWithValue("@Id", id);
                    checkCommand.Parameters.AddWithValue("@CadastroId", usuarioId);
                    connection.Open();

                    var exists = (int)checkCommand.ExecuteScalar();
                    if (exists == 0)
                    {
                        return Forbid("Você não tem permissão para excluir este plantio.");
                    }
                }

                // Se o plantio pertence ao usuário, prosseguir com a exclusão
                var query = "DELETE FROM Plantio WHERE Id = @Id";
                using (var command = new SqlCommand(query, connection))
                {
                    command.Parameters.AddWithValue("@Id", id);
                    var rowsAffected = command.ExecuteNonQuery();

                    if (rowsAffected > 0)
                    {
                        return NoContent(); // Retornar 204 No Content em caso de sucesso
                    }
                }
            }
            return NotFound("Plantio não encontrado.");
        }

    }

}
