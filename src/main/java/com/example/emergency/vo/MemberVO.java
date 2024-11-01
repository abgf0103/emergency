package com.example.emergency.vo;

import lombok.*;

@Getter
@Setter
@ToString
@NoArgsConstructor
public class MemberVO {
    private String memberID;
    private String content;
    private double temperature;

    @Builder
    public MemberVO(String memberID, String content, double temperature) {
        this.memberID = memberID;
        this.content = content;
        this.temperature = temperature;
    }
}
