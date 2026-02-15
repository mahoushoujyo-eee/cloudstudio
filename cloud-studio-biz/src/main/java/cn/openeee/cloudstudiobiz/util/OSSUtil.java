package cn.openeee.cloudstudiobiz.util;

import cn.openeee.cloudstudiobiz.dto.ResourceParam;
import com.aliyun.oss.HttpMethod;
import com.aliyun.oss.OSS;
import com.aliyun.oss.internal.OSSHeaders;
import com.aliyun.oss.model.GeneratePresignedUrlRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import stark.dataworks.boot.web.ServiceResponse;

import java.net.URL;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@Component
public class OSSUtil
{
    @Autowired
    private OSS ossClient;

    public ServiceResponse<URL> getUploadUrl(ResourceParam resourceParam)
    {
        // 设置请求头。
        Map<String, String> headers = new HashMap<>();
        // 指定ContentType。
        headers.put(OSSHeaders.CONTENT_TYPE, resourceParam.getContentType());
        // 指定生成的预签名URL过期时间，单位为毫秒。本示例以设置过期时间为1小时为例。
        Date expiration = new Date(new Date().getTime() + 3600 * 1000L);
        // 生成预签名URL。
        GeneratePresignedUrlRequest request = new GeneratePresignedUrlRequest(resourceParam.getBucketName(), resourceParam.getOssId(), HttpMethod.PUT);
        // 设置过期时间。
        request.setExpiration(expiration);
        request.setHeaders(headers);
        // 通过HTTP PUT请求生成预签名URL。
        URL signedUrl = ossClient.generatePresignedUrl(request);
        // 打印预签名URL。
        log.info("Generated presigned URL: {}", signedUrl);
        return ServiceResponse.buildSuccessResponse(signedUrl);
    }

    public ServiceResponse<URL> getDownloadUrl(ResourceParam resourceParam)
    {
        // 设置预签名URL过期时间，单位为毫秒。本示例以设置过期时间为1小时为例。
        Date expiration = new Date(new Date().getTime() + 3600 * 1000L);
        URL url = ossClient.generatePresignedUrl(resourceParam.getBucketName(), resourceParam.getOssId(), expiration);

        return ServiceResponse.buildSuccessResponse(url);
    }

    public String getContentTypeByFileName(String fileName)
    {
        String extension = fileName.substring(fileName.lastIndexOf('.') + 1).toLowerCase();

        switch (extension)
        {
            case "jpg":
            case "jpeg":
                return "image/jpeg";
            case "png":
                return "image/png";
            case "gif":
                return "image/gif";
            case "webp":
                return "image/webp";
            case "bmp":
                return "image/bmp";
            case "svg":
                return "image/svg+xml";
            case "ico":
                return "image/x-icon";
            default:
                return "application/octet-stream";
        }
    }
}
