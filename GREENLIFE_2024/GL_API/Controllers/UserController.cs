using Microsoft.AspNetCore.Mvc;
using System.Data.SqlClient;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace GL_API.Controllers
    {
        [ApiController]
        [Route("api/[controller]")]
        public class UserController : ControllerBase
        {
            private readonly ILogger<UserController> _logger;

            // Corrigido o ConnectionString
            private const string ConnectionString = "Data Source=(localdb)\\MSSQLLocalDB;Initial Catalog=GL_BD;Integrated Security=True;Connect Timeout=30;Encrypt=False;TrustServerCertificate=False;";

            public UserController(ILogger<UserController> logger)
            {
                _logger = logger;
            }
        [HttpGet(Name = "GetUser")]
        public ActionResult<IEnumerable<Cadastro>> Get()
        {
            var users = new List<Cadastro>();

            using (var connection = new SqlConnection(ConnectionString))
            {
                var query = "SELECT * FROM Cadastro";
                using (var command = new SqlCommand(query, connection))
                {
                    connection.Open();
                    using (var reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            var user = new Cadastro()
                            {
                                Id = Convert.ToInt32(reader["Id"]),
                                Nome= reader["Nome"].ToString(),
                                Email = reader["Email"].ToString(),
                                Senha = reader["Senha"].ToString()
                            };
                            users.Add(user);
                        }
                    }
                }
            }
            return Ok(users);
        }
        [HttpGet("{id}", Name = "GetUserById")]
        public ActionResult<Cadastro> GetUserById(int id)
        {
            using (var connection = new SqlConnection(ConnectionString))
            {
                var query = "SELECT * FROM Cadastro WHERE Id = @Id";
                using (var command = new SqlCommand(query, connection))
                {
                    command.Parameters.AddWithValue("@Id", id);
                    connection.Open();
                    using (var reader = command.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            var user = new Cadastro()
                            {
                                Id = Convert.ToInt32(reader["Id"]),
                                Nome = reader["Nome"].ToString(),
                                Email = reader["Email"].ToString(),
                                Senha = reader["Senha"].ToString()

                            };
                            return Ok(user);
                        }
                    }
                }
            }
            return NotFound();
        }


        [HttpPut("{id}")]
            public ActionResult UpdateUser(int id, [FromBody] Cadastro cadastro)
            {
                using (var connection = new SqlConnection(ConnectionString))
                {
                    var query = "UPDATE Cadastro SET Nome = @Nome, Email = @Email, Senha = @Senha WHERE Id = @Id";
                    using (var command = new SqlCommand(query, connection))
                    {
                    command.Parameters.AddWithValue("@Nome", cadastro.Nome);
                    command.Parameters.AddWithValue("@Email", cadastro.Email);
                    command.Parameters.AddWithValue("@Senha", cadastro.Senha);
                    command.Parameters.AddWithValue("@Id", id);

                        connection.Open();
                        var rowsAffected = command.ExecuteNonQuery();

                        if (rowsAffected > 0)
                        {
                            return Ok(cadastro);
                        }
                    }
                }
                return NotFound();
            }

            [HttpDelete("{id}")]
            public ActionResult DeleteUser(int id)
            {
                using (var connection = new SqlConnection(ConnectionString))
                {
                    var query = "DELETE FROM Cadastro WHERE Id = @Id";
                    using (var command = new SqlCommand(query, connection))
                    {
                        command.Parameters.AddWithValue("@Id", id);

                        connection.Open();
                        var rowsAffected = command.ExecuteNonQuery();

                        if (rowsAffected > 0)
                        {
                            return NoContent();
                        }
                    }
                }
                return NotFound();
            }
        }

    }



