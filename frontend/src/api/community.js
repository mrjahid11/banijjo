import client from "./client";

export const fetchCommunities = () => client.get("/community/all").then(r => r.data);
export const createCommunity = (ownerId, name, description) => client.post("/community/create", { ownerId, name, description }).then(r => r.data);
export const createPost = (authorId, communityId, content) => client.post("/community/post", { authorId, communityId, content }).then(r => r.data);
export const fetchNewsfeed = () => client.get("/community/newsfeed").then(r => r.data);
export const addComment = (postId, authorId, content) => client.post("/community/comment", { postId, authorId, content }).then(r => r.data);
export const likePost = (postId, userId) => client.post("/community/like", { postId, userId });
export const fetchMyCommunities = (ownerId) => {
	const config = ownerId ? { params: { ownerId } } : undefined;
	return client.get(`/community/mine`, config).then(r => r.data);
}
export const fetchPostComments = (postId) => client.get(`/community/post/${postId}/comments`).then(r => r.data);
export const fetchPostLikeCount = (postId) => client.get(`/community/post/${postId}/likes`).then(r => r.data);
