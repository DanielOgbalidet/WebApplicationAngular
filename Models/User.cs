using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace WebApplicationAngular.Models
{
    public class User
    {
        [JsonPropertyName("UserId")]
        public int UserId { get; set; }

        [JsonPropertyName("FirstName")]
        public string FirstName { get; set; } = string.Empty;

        [JsonPropertyName("LastName")]
        public string LastName { get; set; } = string.Empty;

        [JsonPropertyName("Address")]
        public string Address { get; set; } = string.Empty;

        [JsonPropertyName("Number")]
        public string Number { get; set; } = string.Empty;
        [JsonPropertyName("Email")]
        public string Email { get; set; } = string.Empty;
        [JsonPropertyName("Houses")]
        public virtual List<House>? Houses { get; set; }
        [JsonPropertyName("Order")]
        public virtual List<Order>? Order { get; set; }
    }
}
