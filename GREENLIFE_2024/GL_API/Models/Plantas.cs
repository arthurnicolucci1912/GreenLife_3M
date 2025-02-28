using System.Reflection.Metadata;

namespace GL_API.Models
{
    public class Plantas
    {
        public int Id { get; set; }
        public string Nome { get; set; }
        public byte[] Imagem { get; set; }
        public string ComoPlantar { get; set; }
        public string Tipo { get; set; }
        public string Semente { get; set; }
        public string Preciso { get; set; }
        public string Recomendacoes { get; set; }

    }
}
