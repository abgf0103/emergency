package com.example.emergency.adminController;

import com.example.emergency.service.impl.MemberServiceImpl;
import com.example.emergency.vo.MemberVO;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/admin")
public class AdminController {
    @GetMapping
    public String redirectToMemberList() {
        // /admin으로 접근 시 admin/memberList.html로 리다이렉트
        return "redirect:/admin/memberList";
    }

    @GetMapping("/memberList")
    public String memberList() {
        return "admin/memberList"; // admin 폴더 내 memberList.html로 이동
    }
}
