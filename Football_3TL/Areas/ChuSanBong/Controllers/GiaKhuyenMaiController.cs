﻿using Football_3TL.Services;
using Microsoft.AspNetCore.Mvc;

namespace Football_3TL.Areas.ChuSanBong.Controllers
{
    [Area("ChuSanBong")]
    [CheckGoiHetHan]
    public class GiaKhuyenMaiController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
