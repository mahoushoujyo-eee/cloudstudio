package cn.openeee.cloudstudiobiz;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@EnableTransactionManagement
@EnableCaching
@SpringBootApplication
public class CloudStudioBizApplication
{
    public static void main(String[] args) {
        SpringApplication.run(CloudStudioBizApplication.class, args);
    }

}
