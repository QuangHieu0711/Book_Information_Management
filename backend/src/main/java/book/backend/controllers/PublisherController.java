package book.backend.controllers;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import book.backend.models.dtos.publisher.PublisherGetsResponse;
import book.backend.models.dtos.publisher.PublisherRequest;
import book.backend.models.dtos.publisher.PublisherUpdateRequest;
import book.backend.models.global.ApiResult;
import book.backend.services.interfaces.IPublisherServices;
import org.springframework.web.bind.annotation.RequestBody;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@RestController
@RequestMapping("/api/publishers")
public class PublisherController extends ApiBaseController {
    private final IPublisherServices publisherServices;

    public PublisherController(IPublisherServices publisherServices) {
        this.publisherServices = publisherServices;
    }

    @GetMapping
    public ResponseEntity<ApiResult<List<PublisherGetsResponse>>> getsPublisher() {
        return executeApiResult(() -> publisherServices.getsPublisher());
    }

    @PostMapping
    public ResponseEntity<ApiResult<Long>> createPublisher(@Valid @RequestBody PublisherRequest apiRequest) {
        return executeApiResult(() -> publisherServices.createPublisher(apiRequest));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResult<String>> updatePublisher(@PathVariable Long id, @Valid @RequestBody PublisherUpdateRequest apiRequest) {
        return executeApiResult(() -> publisherServices.updatePublisher(id, apiRequest));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResult<String>> deletePublisher(@PathVariable Long id) {
        return executeApiResult(() -> publisherServices.deletePublisher(id));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResult<PublisherGetsResponse>> getPublisherDetail(@PathVariable Long id) {
        return executeApiResult(() -> publisherServices.getPublisherDetail(id));
    }
}