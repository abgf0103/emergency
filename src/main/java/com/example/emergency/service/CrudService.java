package com.example.emergency.service;

import com.example.emergency.vo.MemberVO;

import java.util.List;

public interface CrudService<E> {

    E selectOne(String memberID);
    //memberVO를 수정
    void insert(MemberVO memberVO);
    void update(E e);
    void delete(String memberID);
    List<MemberVO> selectAll(MemberVO memberVO);

}
