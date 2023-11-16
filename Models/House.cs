using System.Text.Json.Serialization;

namespace WebApplicationAngular.Models
{
    public class House
    {
        [JsonPropertyName("HouseId")]
        public int HouseId { get; set; }
        [JsonPropertyName("Price")]
        public decimal Price { get; set; }
        [JsonPropertyName("Address")]
        public string Address { get; set; } = string.Empty;
        [JsonPropertyName("ImageUrl")]
        public string? ImageUrl { get; set; }
        [JsonPropertyName("Bedrooms")]
        public int Bedrooms { get; set; }
        [JsonPropertyName("Guests")]
        public int Guests { get; set; }
        [JsonPropertyName("Description")]
        public string? Description { get; set; }
        [JsonPropertyName("UserId")]
        public virtual int UserId { get; set; }
        [JsonPropertyName("User")]
        [JsonIgnore]
        public virtual User? User { get; set; }
        [JsonPropertyName("Order")]
        public virtual List<Order>? Order { get; set; }
    }
}
