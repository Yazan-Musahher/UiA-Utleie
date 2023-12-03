using System.Collections.Generic;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Stripe;
using Stripe.Checkout;

public class StripeOptions
{
    public string option { get; set; }
}

namespace server.Controllers
{
    public class Program
    {
        public static void Main(string[] args)
        {
            WebHost.CreateDefaultBuilder(args)
              .UseUrls("http://0.0.0.0:5210")
              .UseWebRoot("public")
              .UseStartup<Startup>()
              .Build()
              .Run();
        }
    }

    public class Startup
    {
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddMvc().AddNewtonsoftJson();
        }
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            // This is your test secret API key.
            StripeConfiguration.ApiKey = "sk_test_51OJ0nXHPYHEs6KwMYiypG3iI0ZYc7SMxjhagNoXBDFLbvoppEB6ap524tJH46D6omau8jtEWgzmwjVJ0TLjsAjHY002l8eueR1";
            if (env.IsDevelopment()) app.UseDeveloperExceptionPage();
            app.UseRouting();
            app.UseStaticFiles();
            app.UseEndpoints(endpoints => endpoints.MapControllers());
        }
    }

   [Route("create-checkout-session")]
[ApiController]
public class PaymentController : Controller
{
    [HttpPost]
    public ActionResult Create()
    {
        var domain = "https://localhost:5210";
        var options = new SessionCreateOptions
        {
            LineItems = new List<SessionLineItemOptions>
            {
                new SessionLineItemOptions
                {
                    Price = "price_1OJJ3CHPYHEs6KwMOqC7Rxe0",
                    Quantity = 1,
                },
            },
            Mode = "payment",
            SuccessUrl = "http://localhost:3000/Gallery/Authenticated?session_id={CHECKOUT_SESSION_ID}",
            CancelUrl = domain + "?canceled=true",
        };
        var service = new SessionService();
        Session session = service.Create(options);

        Response.Headers.Add("Location", session.Url);
        return new StatusCodeResult(303);
    }
}
}