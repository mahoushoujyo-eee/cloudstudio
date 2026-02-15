package cn.openeee.cloudstudiobiz.services;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import stark.dataworks.boot.autoconfig.web.LogArgumentsAndResponse;

@Slf4j
@Service
@LogArgumentsAndResponse
public class HealthService
{
    public String check()
    {
        return "OK";
    }
}
