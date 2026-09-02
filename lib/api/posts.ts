export type Post = {
  id: number;
  type: "NORMAL" | "ADOPTION" | "RESCUE";
  image: string;
  status: "ACTIVE" | "CLOSED";
  created_at: string;
  is_liked?: boolean;
  likes_count?: number;
  comments_count?: number;

  name?: string | null;
  age?: number | null;
  gender?: "MALE" | "FEMALE" | "UNKNOWN" | null;
  personality?: string | null;

  is_neutered?: boolean | null;
  is_vaccinated?: boolean | null;

  contact_number?: string | null;

  is_injured?: boolean | null;
  injury_description?: string | null;

  case_number?: string | null;

  city_id?: number | string | null;
  breed_id?: number | string | null;

  breed?: {
    id: number;
    name: string;
  } | null;

  city?: {
    id: number;
    name: string;
  } | null;

  user: {
    id: number;
    username: string;
    avatar_url: string | null;
  };
};

export type CommentType = {
  id: number;
  content: string;
  created_at: string;
  user: {
    id: number;
    username: string;
    avatar_url: string | null;
  };
};

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

export async function getPosts(type?: "NORMAL" | "ADOPTION" | "RESCUE", token?: string): Promise<Post[]> {
  const url = type ? `${API_URL}/posts?type=${type}` : `${API_URL}/posts`;
  const headers: HeadersInit = { "Accept": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const response = await fetch(url, { headers, cache: 'no-store' }); 

  if (!response.ok) {
    throw new Error("Failed to fetch posts");
  }

  const data = await response.json();
  return data.posts || data.data || (Array.isArray(data) ? data : []);
}

export async function getPostById(id: number | string, token?: string): Promise<Post | null> {
  try {
    const headers: HeadersInit = { "Accept": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const response = await fetch(`${API_URL}/posts/${id}`, { headers, cache: 'no-store' });

    if (response.ok) {
      const data = await response.json();
      const singlePost = data.post || data.data || data;
      if (singlePost && typeof singlePost === "object" && "id" in singlePost) {
        return singlePost as Post;
      }
    }

    const allPosts = await getPosts(undefined, token);
    return allPosts.find((post) => String(post.id) === String(id)) || null;
  } catch (error) {
    console.error("Error fetching post by ID:", error);
    return null;
  }
}

export async function sendAdoptionRequestApi(postId: number | string, token: string) {
  const response = await fetch(`${API_URL}/posts/${postId}/adoption-requests`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
      "Accept": "application/json",
    },
  });

  const resData = await response.json();
  if (!response.ok) {
    throw new Error(resData.message || resData.error || "Failed to send adoption request");
  }
  return resData;
}

export async function sendRescueRequestApi(postId: number | string, token: string) {
  const response = await fetch(`${API_URL}/posts/${postId}/rescue-requests`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
      "Accept": "application/json",
    },
  });

  const resData = await response.json();
  if (!response.ok) {
    throw new Error(resData.message || resData.error || "Failed to send rescue request");
  }
  return resData;
}

export async function toggleLikeApi(postId: number | string, token: string) {
  const response = await fetch(`${API_URL}/posts/${postId}/like`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Accept": "application/json",
    },
  });

  const resData = await response.json();
  if (!response.ok) {
    throw new Error(resData.message || "Failed to process like");
  }
  return resData;
}

export async function getCommentsApi(postId: number | string, token?: string): Promise<CommentType[]> {
  const headers: HeadersInit = { "Accept": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const response = await fetch(`${API_URL}/posts/${postId}/comments`, { 
    headers, 
    cache: 'no-store' 
  });
  
  const resData = await response.json();

  if (!response.ok) {
    throw new Error(resData.message || "Failed to fetch comments");
  }
  return resData.comments || resData.data || (Array.isArray(resData) ? resData : []);
}

export async function addCommentApi(postId: number | string, content: string, token: string) {
  const response = await fetch(`${API_URL}/posts/${postId}/comments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
      "Accept": "application/json",
    },
    body: JSON.stringify({ content }),
  });

  const resData = await response.json();
  if (!response.ok) {
    throw new Error(resData.message || "Failed to add comment");
  }
  return resData;
}

export async function deleteCommentApi(commentId: number | string, token: string) {
  const response = await fetch(`${API_URL}/comments/${commentId}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Accept": "application/json",
    },
  });

  const resData = await response.json();
  if (!response.ok) {
    throw new Error(resData.message || "Failed to delete comment");
  }
  return resData;
}

export async function createPostApi(formData: FormData, token: string) {
  const response = await fetch(`${API_URL}/posts`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Accept": "application/json",
    },
    body: formData,
  });

  const resData = await response.json();
  if (!response.ok) {
    throw new Error(resData.message || "Failed to create post");
  }
  return resData;
}

export async function deletePostApi(postId: number | string, token: string) {
  const response = await fetch(`${API_URL}/posts/${postId}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Accept": "application/json",
    },
  });

  const resData = await response.json();
  if (!response.ok) {
    throw new Error(resData.message || "Unauthorized or failed to delete post");
  }
  return resData;
}

export async function loginApi(data: { login: string; password: string }) {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify({
      login: data.login,      
      password: data.password,
    }),
  });

  const resData = await response.json();
  if (!response.ok) {
    throw new Error(resData.message || "Invalid credentials");
  }
  return resData;
}

export async function registerApi(data: {
  fullName: string;
  username: string;
  email: string;
  password: string;
}) {
  const response = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify({
      full_name: data.fullName, 
      username: data.username,
      email: data.email,
      password: data.password,
    }),
  });

  const resData = await response.json();
  if (!response.ok) {
    const errorMsg = resData.message || resData.error || "Failed to register";
    throw new Error(errorMsg);
  }
  return resData;
}

export function getFullImageUrl(imagePath?: string | null): string {
  if (!imagePath) return "";

  if (
    imagePath.startsWith("http://") ||
    imagePath.startsWith("https://") ||
    imagePath.startsWith("data:")
  ) {
    return imagePath;
  }

  const cleanPath = imagePath.startsWith("/")
    ? imagePath
    : `/${imagePath}`;

  return `${API_URL.replace("/api", "")}${cleanPath}`;
}

export async function updatePostApi(postId: number | string, formData: FormData, token: string) {
  formData.append("_method", "PUT");

  const response = await fetch(`${API_URL}/posts/${postId}`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Accept": "application/json",
    },
    body: formData,
  });

  const resData = await response.json();
  if (!response.ok) {
    throw new Error(resData.message || resData.error || "Failed to update post");
  }
  return resData;
}

export async function getCitiesApi() {
  const res = await fetch(`${API_URL}/cities`, {
    headers: { Accept: "application/json" },
  });
  if (!res.ok) throw new Error("Failed to fetch cities");
  const data = await res.json();
  return data.cities || data.data || (Array.isArray(data) ? data : []);
}

export async function getBreedsApi() {
  const res = await fetch(`${API_URL}/breeds`, {
    headers: { Accept: "application/json" },
  });
  if (!res.ok) throw new Error("Failed to fetch breeds");
  const data = await res.json();
  return data.breeds || data.data || (Array.isArray(data) ? data : []);
}

export async function updatePostStatusApi(
  postId: number | string,
  status: "ACTIVE" | "CLOSED",
  token: string
) {
  const response = await fetch(`${API_URL}/posts/${postId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
      "Accept": "application/json",
    },
    body: JSON.stringify({ status }),
  });

  const resData = await response.json();
  if (!response.ok) {
    throw new Error(resData.message || resData.error || "Failed to update status");
  }
  return resData;
}

export async function getProfileApi(token: string) {
  const response = await fetch(`${API_URL}/me`, {
    headers: {
      "Authorization": `Bearer ${token}`,
      "Accept": "application/json",
    },
    cache: "no-store",
  });

  const resData = await response.json();

  if (!response.ok) {
    throw new Error(resData.message || "Unauthorized");
  }

  return resData.user || resData.data || resData;
}

export async function updateProfileApi(formData: FormData, token: string) {
  formData.append("_method", "PUT");

  const response = await fetch(`${API_URL}/me`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Accept": "application/json",
    },
    body: formData,
  });

  const resData = await response.json();

  if (!response.ok) {
    throw new Error(resData.message || "Failed to update profile");
  }

  return resData.user || resData.data || resData;
}

export async function getNotificationsApi(token: string) {
  const res = await fetch(`${API_URL}/notifications`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch notifications: ${res.status}`);
  }

  const data = await res.json();
  return data.notifications || data.data || data;
}

export async function updateNotificationStatusApi(id: string, status: string, token: string) {
  const res = await fetch(`${API_URL}/notifications/${id}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
    body: JSON.stringify({ status: status.toUpperCase() }),
  });

  const resData = await res.json();

  if (!res.ok) {
    throw new Error(resData.message || "Failed to update notification status");
  }

  return resData;
}