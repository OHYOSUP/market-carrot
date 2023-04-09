import type { NextPage } from "next";
import Button from "@components/button";
import Input from "@components/input";
import Layout from "@components/layout";
import { useForm } from "react-hook-form";
import useSWR from "swr";
import { useEffect, useState } from "react";
import useUser from "@libs/client/useUser";
import useMutation from "@libs/client/useMutation";

interface EditProfileForm {
  email?: string;
  name?: string;
  phone?: string;
  avatar: FileList;
  editError?: string;
}

interface EditProfileResponse {
  ok: boolean;
  error?: string;
}

const EditProfile: NextPage = () => {
  const {
    register,
    handleSubmit,
    setValue,
    setError,
    watch,
    formState: { errors },
  } = useForm<EditProfileForm>();
  const [editprofile, { data, loading }] =
    useMutation<EditProfileResponse>("/api/users/me");
  const { user } = useUser();
  const [avatarPreview, setAvatarPreview] = useState("");
  useEffect(() => {
    if (user?.name) setValue("name", user?.name);
    if (user?.email) setValue("email", user?.email);
    if (user?.phone) setValue("phone", user?.phone);
    if (user?.avatar) setAvatarPreview(`https://imagedelivery.net/qAo6HOS4v4y6BS793NiRZw/${user.avatar}/avatar`)

  }, [user, setValue]);

  const onValid = async ({ email, phone, name, avatar }: EditProfileForm) => {
    if (loading) return;
    if (email === "" && phone === "" && name === "") {
      return setError("editError", {
        message: "이메일또는 전화번호를 입력해주세요.",
      });
    }
    if (avatar && avatar.length > 0 && user?.id) {
      const { uploadURL } = await (await fetch("/api/files")).json();

      const form = new FormData();
      await form.append("file", avatar[0], user?.id + "");
      const {
        result: { id },
      } = await (
        await fetch(uploadURL, {
          method: "POST",
          body: form,
        })
      ).json();

      editprofile({ email, phone, name, avatarId: id });
    } else {
      editprofile({ email, phone, name, avatar });
    }
  };

  useEffect(() => {
    if (data && !data.ok && data.error) {
      setError("editError", { message: data.error });
    }
  }, [data, setError]);

  const avatar = watch("avatar");
  useEffect(() => {
    if (avatar && avatar.length > 0) {
      const file = avatar[0];
      setAvatarPreview(URL.createObjectURL(file));
    }
  }, [avatar]);

  return (
    <Layout canGoBack title="Edit Profile">
      <form onSubmit={handleSubmit(onValid)} className="py-10 px-4 space-y-4">
        <div className="flex items-center space-x-3">
          {avatarPreview ? (
            <img src={avatarPreview} className="w-14 h-14 rounded-full" />
          ) : (
            <div className="w-14 h-14 rounded-full" />
          )}

          <label
            htmlFor="picture"
            className="cursor-pointer py-2 px-3 border hover:bg-gray-50 border-gray-300 rounded-md shadow-sm text-sm font-medium focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 text-gray-700"
          >
            Change
            <input
              {...register("avatar")}
              id="picture"
              type="file"
              className="hidden"
              accept="image/*"
            />
          </label>
        </div>
        <Input
          register={register("name")}
          label="Name address"
          name="name"
          type="text"
        />
        <Input
          register={register("email")}
          label="Email address"
          name="email"
          type="email"
        />
        <Input
          register={register("phone")}
          label="Phone number"
          name="phone"
          type="number"
          kind="phone"
        />
        {errors.editError ? (
          <span className="my-2 text-red-500 font-medium text-center block">
            {errors.editError.message}
          </span>
        ) : null}
        <Button text={loading ? "Loading" : "프로필 업데이트"} />
      </form>
    </Layout>
  );
};

export default EditProfile;
