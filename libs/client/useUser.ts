import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import useSWR from "swr";

interface EditProfileResponse {
  email?: string;
  phone?: string;
}

export default function useUser<EditProfileResponse>() {
  // const { data, error } = useSWR(
  //   typeof window === "undefined" ? null : "/api/users/me"
  // );
  const router = useRouter();

  const [url, setUrl] = useState("");
  useEffect(() => {
    setUrl("/api/users/me");
  }, []);
  const { data, error } = useSWR(url);

  useEffect(() => {
    if (data && !data.ok) {
      router.replace("/enter");
    }
    // if (data && data.ok && router.pathname === "/enter") {
    //   router.replace("/profile")
    // }
  }, [data, router]);

  return { user: data?.profile, isLoading: !data && !error };
}
