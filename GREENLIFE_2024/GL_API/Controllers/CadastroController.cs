using GL_API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Data.SqlClient;
using System.Threading.Tasks;

namespace GL_API.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class CadastroController : ControllerBase
    {
        private readonly ILogger<CadastroController> _logger;

        public const string ConnectionString = "Data Source=(localdb)\\MSSQLLocalDB;Initial Catalog=GL_BD;Integrated Security=True;Connect Timeout=30;Encrypt=False;TrustServerCertificate=False;";

        public CadastroController(ILogger<CadastroController> logger)
        {
            _logger = logger;
        }

        [HttpPost("Cadastro")]
        public async Task<ActionResult<bool>> EfetuarCadastro([FromBody] Cadastro cadastro)
        {
            if (cadastro == null || string.IsNullOrEmpty(cadastro.Nome) || string.IsNullOrEmpty(cadastro.Senha) || string.IsNullOrEmpty(cadastro.Email))
            {
                return BadRequest("Dados inválidos");
            }

            try
            {
                using (SqlConnection connection = new SqlConnection(ConnectionString))
                {
                    await connection.OpenAsync();

                    string query = "INSERT INTO Cadastro (Nome, Email, Senha) VALUES (@Nome, @Email, @Senha)";
                    using (SqlCommand command = new SqlCommand(query, connection))
                    {
                        command.Parameters.AddWithValue("@Nome", cadastro.Nome);
                        command.Parameters.AddWithValue("@Email", cadastro.Email);
                        command.Parameters.AddWithValue("@Senha", cadastro.Senha);

                        int result = await command.ExecuteNonQueryAsync();

                        if (result > 0)
                        {
                            return Ok(true); // Registro inserido com sucesso
                        }
                        else
                        {
                            return BadRequest("Falha ao cadastrar");
                        }
                    }
                }
            }
            catch (SqlException sqlEx)
            {
                _logger.LogError(sqlEx, "Erro ao cadastrar usuário: {Message}", sqlEx.Message);
                return StatusCode(500, $"Erro ao acessar o banco de dados {sqlEx.Message}");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao cadastrar usuário");
                return StatusCode(500, "Erro interno no servidor");
            }
        }

        [HttpPost("Login")]
        public async Task<ActionResult<string>> EfetuarLogin([FromBody] Login login)
        {
            if (login == null || string.IsNullOrEmpty(login.Email) || string.IsNullOrEmpty(login.Senha))
            {
                return BadRequest("Dados inválidos");
            }

            try
            {
                using (SqlConnection connection = new SqlConnection(ConnectionString))
                {
                    await connection.OpenAsync();

                    // Verificar se é um Admin
                    string adminQuery = "SELECT Senha FROM Admin WHERE Email = @Email";
                    using (SqlCommand adminCommand = new SqlCommand(adminQuery, connection))
                    {
                        adminCommand.Parameters.AddWithValue("@Email", login.Email);

                        object result = await adminCommand.ExecuteScalarAsync();
                        if (result != null)
                        {
                            string storedPassword = result.ToString();

                            // Comparar senhas diretamente (não recomendado)
                            if (login.Senha == storedPassword)
                            {
                                return Ok("Admin");
                            }
                        }
                    }

                    // Verificar se é um Usuário
                    string userQuery = "SELECT Senha FROM Cadastro WHERE Email = @Email";
                    using (SqlCommand userCommand = new SqlCommand(userQuery, connection))
                    {
                        userCommand.Parameters.AddWithValue("@Email", login.Email);

                        object result = await userCommand.ExecuteScalarAsync();
                        if (result != null)
                        {
                            string storedPassword = result.ToString();

                            // Comparar senhas diretamente (não recomendado)
                            if (login.Senha == storedPassword)
                            {
                                return Ok("User");
                            }
                        }
                    }

                    return Unauthorized(); // Retornar 401 se não for encontrado
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao efetuar login");
                return StatusCode(500, "Erro interno no servidor");
            }
        }
    }
}
