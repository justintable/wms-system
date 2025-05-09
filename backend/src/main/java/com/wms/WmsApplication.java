package com.wms;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.mybatis.spring.annotation.MapperScan;

@SpringBootApplication
@MapperScan("com.wms.mapper")
public class WmsApplication {
    public static void main(String[] args) {
        SpringApplication.run(WmsApplication.class, args);
    }
} 