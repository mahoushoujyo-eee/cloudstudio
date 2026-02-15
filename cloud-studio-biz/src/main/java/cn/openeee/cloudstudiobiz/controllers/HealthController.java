package cn.openeee.cloudstudiobiz.controllers;

import cn.openeee.cloudstudiobiz.services.HealthService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/health")
public class HealthController
{
    @Autowired
    private HealthService healthService;

    @RequestMapping("/check")
    public String check()
    {
        return healthService.check();
    }
}
