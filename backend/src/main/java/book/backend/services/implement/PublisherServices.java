package book.backend.services.implement;

import java.util.Comparator;
import java.util.List;

import org.springframework.stereotype.Service;

import book.backend.models.dtos.publisher.PublisherGetsResponse;
import book.backend.models.dtos.publisher.PublisherRequest;
import book.backend.models.dtos.publisher.PublisherUpdateRequest;
import book.backend.models.entities.Publisher;
import book.backend.models.global.ApiResult;
import book.backend.repositories.PublisherRepository;
import book.backend.services.interfaces.IPublisherServices;

@Service
public class PublisherServices implements IPublisherServices {
    private final PublisherRepository publisherRepository;

    public PublisherServices(PublisherRepository publisherRepository) {
        this.publisherRepository = publisherRepository;
    }

    @Override
    public ApiResult<List<PublisherGetsResponse>> getsPublisher() {
        List<Publisher> publishers = publisherRepository.findAll();
        List<PublisherGetsResponse> responseList = publishers.stream()
                .map(publisher -> new PublisherGetsResponse(
                        publisher.getId(),
                        publisher.getPublisherName(),
                        publisher.getAddress(),
                        publisher.getPhone(),
                        publisher.getEmail(),
                        publisher.getWebsite(),
                        publisher.getIsActive(),
                        publisher.getCreatedAt()))
                .sorted(Comparator.comparing(PublisherGetsResponse::getCreatedAt).reversed())
                .toList();
        return ApiResult.success(responseList, "Lấy danh sách nhà xuất bản thành công");
    }

    @Override
    public ApiResult<Long> createPublisher(PublisherRequest request) {
        Publisher pub = new Publisher();
        pub.setPublisherName(request.getPublisherName());
        pub.setAddress(request.getAddress());
        pub.setPhone(request.getPhone());
        pub.setEmail(request.getEmail());
        pub.setWebsite(request.getWebsite());
        pub.setIsActive(request.getIsActive());
        publisherRepository.save(pub);
        return ApiResult.success(pub.getId(), "Tạo nhà xuất bản thành công");           
    }

    @Override
    public ApiResult<String> updatePublisher(Long id, PublisherUpdateRequest request) {
        Publisher pub = publisherRepository.findById(id).orElseThrow(() -> new RuntimeException("Nhà xuất bản không tồn tại"));
        pub.setPublisherName(request.getPublisherName());
        pub.setAddress(request.getAddress());
        pub.setPhone(request.getPhone());
        pub.setEmail(request.getEmail());
        pub.setWebsite(request.getWebsite());
        pub.setIsActive(request.getIsActive());
        publisherRepository.save(pub);
        return ApiResult.success(null, "Cập nhật nhà xuất bản thành công");
    }

    @Override
    public ApiResult<String> deletePublisher(Long id) {
        Publisher pub = publisherRepository.findById(id).orElseThrow(() -> new RuntimeException("Nhà xuất bản không tồn tại"));
        publisherRepository.delete(pub);
        return ApiResult.success(null, "Xóa nhà xuất bản thành công");
    }

    @Override
    public ApiResult<PublisherGetsResponse> getPublisherDetail(Long id) {
        Publisher pub = publisherRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Nhà xuất bản không tồn tại"));
        PublisherGetsResponse detail = new PublisherGetsResponse(
                pub.getId(),
                pub.getPublisherName(),
                pub.getAddress(),
                pub.getPhone(),
                pub.getEmail(),
                pub.getWebsite(),
                pub.getIsActive(),
                pub.getCreatedAt()
        );
        return ApiResult.success(detail, "Lấy chi tiết nhà xuất bản thành công");
    }
}