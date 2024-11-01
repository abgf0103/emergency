package com.example.emergency.memberController;

import com.example.emergency.service.impl.MemberServiceImpl;
import com.example.emergency.vo.MemberVO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.util.List;

@RestController
@RequestMapping("/member")
@Slf4j
public class MemberController {
    private final MemberServiceImpl memberService;

    public MemberController(MemberServiceImpl memberService) {
        this.memberService = memberService;
    }

    @GetMapping("/check")
    public ResponseEntity<MemberVO> checkMember(@RequestParam("memberID") String memberID) { //URL 파라미터 memberID를 memberID 변수로
        MemberVO member = memberService.selectOne(memberID); // memberID를 직접 전달
        return ResponseEntity.ok(member); // memberDto를 클라이언트에 반환
    }

    @PostMapping("/update")
    public void updateMember(@RequestBody MemberVO member) {
        log.info("============================");
        log.info("컨트롤러 데이터");
        log.info(member.toString());
        memberService.update(member);
    }

    @PostMapping("/insert")
    public void insertMember(@RequestBody MemberVO member) {
        log.info(member.toString());
        memberService.insert(member);
    }

    @GetMapping("/list")
    public ResponseEntity<?> memberList(@ModelAttribute MemberVO member) {
        log.info(member.toString());
        return ResponseEntity.ok(memberService.selectAll(member));
    }

    @DeleteMapping("/delete")
    public void deleteMember(@RequestParam("memberID") String memberID) {
        log.info(memberID);
        memberService.delete(memberID);
    }
}
