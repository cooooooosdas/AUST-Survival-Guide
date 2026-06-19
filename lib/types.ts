export type LinkItem = {
  title: string;
  url: string;
  description?: string;
  icon?: string;
  tag?: string;
};

export type LinkGroup = {
  id: string;
  title: string;
  items: LinkItem[];
};

export type Profile = {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  created_at: string;
};

export type CommentTargetType = "global" | "section" | "letter";

export type Comment = {
  id: number;
  user_id: string;
  target_type: CommentTargetType;
  target_id: string;
  content: string;
  created_at: string;
  display_name: string | null;
  avatar_url: string | null;
};
