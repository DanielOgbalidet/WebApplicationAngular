﻿using Microsoft.AspNetCore.Mvc;

namespace WebApplicationAngular.Controllers
{
    public class HomeController : Controller
    {
        // GET: /<controller>/
        public IActionResult Index()
        {
            return View();
        }
    }
}

