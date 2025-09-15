package book.backend.services.interfaces;

import java.util.List;

import book.backend.models.dtos.publisher.PublisherGetsResponse;
import book.backend.models.dtos.publisher.PublisherRequest;
import book.backend.models.dtos.publisher.PublisherUpdateRequest;
import book.backend.models.global.ApiResult;

public interface IPublisherServices {
    ApiResult<PublisherGetsResponse> getPublisherDetail(Long id);
    ApiResult<List<PublisherGetsResponse>> getsPublisher();
    ApiResult<Long> createPublisher(PublisherRequest publisher);
    ApiResult<String> updatePublisher(Long id, PublisherUpdateRequest publisher);
    ApiResult<String> deletePublisher(Long id);
}
