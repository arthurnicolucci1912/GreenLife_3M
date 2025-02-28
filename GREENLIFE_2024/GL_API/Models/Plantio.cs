namespace GL_API
{
    public class Plantio
    {
        public int Id { get; set; } 
        public string NomePlantio { get; set; }
        public DateTime DataPlantio { get; set; } // Tipo DateTime
        public string Tipo { get; set; }
        public string Semente { get; set; }
        public string Local { get; set; }
        public DateTime DataColheita { get; set; } // Tipo DateTime
    }

}
