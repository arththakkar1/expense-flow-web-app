import React from "react";
import Image from "next/image";
import { Pencil } from "lucide-react"; // Import Pencil icon
import { UserType } from "@/app/(dashboard)/profile/page";

// Define the shape of the profile prop
interface Profile {
  id: string;
  full_name: string | null;
  email: string | null;
  avatar_url: string | null;
}

interface ProfileHeaderProps {
  profile: Profile;
  onEdit: () => void;
  user: UserType;
}

export default function ProfileHeader({
  profile,
  onEdit,
  user,
}: ProfileHeaderProps) {
  return (
    <div className="relative bg-gradient-to-br from-zinc-900 via-zinc-900 to-blue-900/20 border border-zinc-800 rounded-xl p-6 sm:p-8">
      {/* --- Edit Button --- */}
      <button
        onClick={onEdit}
        className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700/50 rounded-lg text-zinc-400 hover:text-white transition-all"
        aria-label="Edit profile"
      >
        <Pencil className="w-4 h-4" />
      </button>

      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-4xl shadow-lg">
          {profile?.avatar_url ? (
            <Image
              height={1000}
              width={1000}
              src={profile.avatar_url}
              alt="User Avatar"
              className="rounded-full w-full h-full object-cover"
            />
          ) : (
            profile?.full_name?.charAt(0) || "👤"
          )}
        </div>
        <div className="flex-1 text-center sm:text-left">
          <h2 className="text-2xl sm:text-3xl font-bold mb-2">
            {profile?.full_name ?? user?.user_metadata?.full_name}
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base">
            {profile?.email || "No email provided"}
          </p>
        </div>
      </div>
    </div>
  );
}
