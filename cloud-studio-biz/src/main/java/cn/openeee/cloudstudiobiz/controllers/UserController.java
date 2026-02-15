package cn.openeee.cloudstudiobiz.controllers;

import cn.openeee.cloudstudiobiz.dao.UserMapper;
import cn.openeee.cloudstudiobiz.entities.UserInfo;
import cn.openeee.cloudstudiobiz.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import stark.coderaider.titan.gate.loginstate.UserContextService;
import stark.dataworks.boot.web.ServiceResponse;

import java.net.URL;

@RestController
@RequestMapping("/user")
public class UserController
{
    @Autowired
    UserService userService;

    @GetMapping("/info")
    public ServiceResponse<UserInfo> getUserBasicInfo()
    {
        ServiceResponse<UserInfo> userInfo = userService.getUserInfo(UserContextService.getCurrentUserId());
        return userInfo;
    }

    @PostMapping("/info")
    public ServiceResponse<Boolean> changeUserBasicInfo(@RequestBody UserInfo userInfo)
    {
        return userService.changeUserBasicInfo(userInfo);
    }

    @GetMapping("/count")
    public ServiceResponse<Integer> getUserTimeCount()
    {
        // TODO: 实现获取用户时间统计的业务逻辑
        return ServiceResponse.buildSuccessResponse(100);
    }
    
    @PostMapping("/avatar")
    public ServiceResponse<URL> changeUserAvatar(@RequestBody UserInfo userInfo)
    {
        return userService.changeUserAvatar(userInfo);
    }
    
    @GetMapping("/{id}")
    public ServiceResponse<UserInfo> getUserInfo(@PathVariable long id) {
        return userService.getUserInfo(id);
    }
    
    @PostMapping("/create")
    public ServiceResponse<Boolean> createUser(@RequestBody UserInfo userInfo) {
        return userService.createUser(userInfo);
    }
}