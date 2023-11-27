using System.Text.Json.Serialization;

namespace WebApplicationAngular.Models
{
    public class Order
    {
        [JsonPropertyName("OrderId")]
        public int OrderId { get; set; }
        [JsonPropertyName("OrderDate")]
        public string OrderDate { get; set; } = string.Empty;
        [JsonPropertyName("UserId")]
        public int UserId { get; set; }
        [JsonPropertyName("User")]
        [JsonIgnore]
        public virtual User? User { get; set; }
        [JsonPropertyName("HouseId")]
        public int HouseId { get; set; }
        [JsonPropertyName("House")]
        [JsonIgnore]
        public virtual House? House { get; set; }
        [JsonPropertyName("StartDate")]
        public string StartDate { get; set; } = string.Empty;
        [JsonPropertyName("EndDate")]
        public string EndDate { get; set; } = string.Empty;
        [JsonPropertyName("TotalPrice")]
        public decimal TotalPrice { get; set; }
    }
}
