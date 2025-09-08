package com.banijjo.Banjijjo.dto;

public class CommunityDtos {
    public static class CreateCommunityRequest {
        public Long ownerId;
        public String name;
        public String description;
    }

    public static class CreatePostRequest {
        public Long authorId;
        public Long communityId;
        public String content;
    }
}
