package com.example.emergency.service.impl;

import com.example.emergency.memberMapper.MemberMapper;
import com.example.emergency.vo.MemberVO;
import com.example.emergency.service.CrudService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
public class MemberServiceImpl implements CrudService<MemberVO> {
    private final MemberMapper memberMapper;
    public MemberServiceImpl(MemberMapper memberMapper) {
        this.memberMapper = memberMapper;
    }

    @Override
    public MemberVO selectOne(String memberID) {
        return memberMapper.findMemberByID(memberID);
    }

    @Override
    public void update(MemberVO memberVO) {
        log.info(memberVO.toString());
        memberMapper.updateMemberInfo(memberVO);
    }

    @Override
    public void insert(MemberVO memberVO) {
        memberMapper.insertMemberInfo(memberVO);
    }

    @Override
    public void delete(String memberID) {
        log.info(memberID);
        memberMapper.deleteMemberInfo(memberID);
    }

    @Override
    public List<MemberVO> selectAll(MemberVO memberVO) {
        return memberMapper.findMemberList(memberVO);
    }
}
