using Microsoft.AspNetCore.Mvc;
using System.Data.SqlClient;
using System.Collections.Generic;
using GL_API.Models;
using static System.Runtime.InteropServices.JavaScript.JSType;
using System;

namespace GL_API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PlantasController : ControllerBase
    {
        private const string ConnectionString = "Data Source=(localdb)\\MSSQLLocalDB;Initial Catalog = GL_BD; Integrated Security = True; Connect Timeout = 30; Encrypt=False;TrustServerCertificate=False;";

        [HttpGet("search")]
        public ActionResult<IEnumerable<object>> Search([FromQuery] string nome)
        {
            var plantas = new List<object>();

            using (var connection = new SqlConnection(ConnectionString))
            {
                var query = "SELECT * FROM Plantas WHERE Nome LIKE @Nome";
                using (var command = new SqlCommand(query, connection))
                {
                    command.Parameters.AddWithValue("@Nome", "%" + nome + "%");
                    connection.Open();

                    using (var reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            // Convertendo a imagem para base64
                            byte[] imagemBytes = reader["Imagem"] as byte[];
                            string imagemBase64 = imagemBytes != null ? Convert.ToBase64String(imagemBytes) : null;
                            string imagemDataUrl = imagemBase64 != null ? $"data:image/png;base64,{imagemBase64}" : null;

                            var planta = new
                            {
                                Id = Convert.ToInt32(reader["Id"]),
                                Nome = reader["Nome"].ToString(),
                                Imagem = imagemDataUrl,
                                ComoPlantar = reader["ComoPlantar"].ToString(),
                                Tipo = reader["Tipo"].ToString(),
                                Semente = reader["Semente"].ToString(),
                                Preciso = reader["Preciso"].ToString(),
                                Recomendacoes = reader["Recomendacoes"].ToString()
                            };

                            plantas.Add(planta);
                        }
                    }
                }
            }

            return Ok(plantas);
        }
    }
}
