export type JwtAccessPayload = {
  uid: number;
  email: string;
  nickname?: string;
  profile_image_url?: string;
};
