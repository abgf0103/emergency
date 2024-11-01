package com.example.emergency.memberMapper;

import com.example.emergency.vo.MemberVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface MemberMapper {
    MemberVO findMemberByID(@Param("memberID") String memberID);
    List<MemberVO> findMemberList(MemberVO memberVO);

    void updateMemberInfo(MemberVO memberVO);
    void insertMemberInfo(MemberVO memberVO);
    void deleteMemberInfo(@Param("memberID") String memberID);
}
