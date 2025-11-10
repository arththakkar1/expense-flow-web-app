"use client";

import React, { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { X, User, Camera, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";

// Animation variants
const overlayVariants = {
  visible: { opacity: 1 },
  hidden: { opacity: 0 },
};
const dialogVariants = {
  visible: { scale: 1, opacity: 1, y: 0 },
  hidden: { scale: 0.95, opacity: 0, y: 20 },
};

// Define the shape of the profile prop
interface Profile {
  id: string; // This is the 'id' from the profiles table
  user_id: string; // This is the 'user_id' (foreign key)
  full_name: string | null;
  email: string | null;
  avatar_url: string | null;
}

interface EditProfileDialogProps {
  isOpen: boolean;
  onClose: () => void;
  profile: Profile;
}

export default function EditProfileDialog({
  isOpen,
  onClose,
  profile,
}: EditProfileDialogProps) {
  const queryClient = useQueryClient();
  const supabase = createClient();

  const [fullName, setFullName] = useState(profile.full_name || "");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    profile.avatar_url
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Reset form when modal opens or profile changes
  useEffect(() => {
    if (isOpen) {
      setFullName(profile.full_name || "");
      setAvatarFile(null);
      setAvatarPreview(profile.avatar_url);
      setError(null);
      setIsSubmitting(false);
      setIsDragging(false);
    }
  }, [isOpen, profile]);

  // Handle Escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  // --- New helper to handle file logic ---
  const handleFileChange = (file: File | undefined) => {
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        // 2MB limit
        setError("File is too large. Maximum size is 2MB.");
        return;
      }
      if (!["image/png", "image/jpeg", "image/jpg"].includes(file.type)) {
        setError("Invalid file type. Please upload a PNG or JPG.");
        return;
      }
      setError(null);
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  // --- Updated to use the helper ---
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileChange(e.target.files?.[0]);
  };

  // --- Drag and Drop Handlers ---
  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFileChange(e.dataTransfer.files?.[0]);
  };

  //
  // --- THIS IS THE CORRECTED handleSubmit FUNCTION ---
  //
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    let newAvatarUrl = profile.avatar_url; // Start with the old URL

    if (avatarFile) {
      const filePath = `${profile.id}/${avatarFile.name}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars") // Your bucket name
        .upload(filePath, avatarFile, {
          upsert: true, // Overwrite existing file
        });

      console.log(uploadError);

      if (uploadError) {
        setError(uploadError.message);
        setIsSubmitting(false);
        return;
      }

      // Get the public URL for the newly uploaded file
      const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);

      if (!data.publicUrl) {
        setError("Could not get public URL for the uploaded image.");
        setIsSubmitting(false);
        return;
      }
      newAvatarUrl = data.publicUrl;
    }

    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        full_name: fullName,
        avatar_url: newAvatarUrl,
        updated_at: new Date().toISOString(),
      })
      .eq("id", profile.id);

    if (updateError) {
      setError(updateError.message);
      setIsSubmitting(false);
      return;
    }

    await queryClient.invalidateQueries({ queryKey: ["profile"] });
    await queryClient.invalidateQueries({ queryKey: ["user"] });
    await queryClient.invalidateQueries({ queryKey: ["userProfile"] });

    setIsSubmitting(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={overlayVariants}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 w-full max-w-md relative shadow-2xl shadow-blue-500/10"
            variants={dialogVariants}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                <User className="w-5 h-5 text-blue-400" />
              </div>
              <h2 className="text-2xl font-bold text-white">Edit Profile</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* --- Profile Photo Uploader --- */}
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">
                  Profile Photo
                </label>
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/png, image/jpeg, image/jpg"
                  onChange={handleAvatarChange}
                  disabled={isSubmitting}
                />
                <div
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  className={`w-full border-2 border-dashed rounded-lg p-6 transition-colors
                    ${
                      isDragging
                        ? "border-blue-500 bg-blue-500/10"
                        : "border-zinc-700 hover:border-zinc-500"
                    }
                  `}
                >
                  <label
                    htmlFor="avatar-upload"
                    className="flex flex-col items-center justify-center w-full cursor-pointer"
                  >
                    {avatarPreview ? (
                      // Show preview if it exists
                      <>
                        <div className="relative w-20 h-20">
                          <Image
                            src={avatarPreview}
                            alt="Profile preview"
                            width={80}
                            height={80}
                            className="rounded-full object-cover w-20 h-20"
                          />
                          {isSubmitting && avatarFile && (
                            <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center">
                              <Loader2 className="w-6 h-6 text-white animate-spin" />
                            </div>
                          )}
                        </div>
                        <span className="text-sm text-zinc-400 mt-4">
                          Click or drag to change photo
                        </span>
                      </>
                    ) : (
                      // Show placeholder if no preview
                      <>
                        <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mb-3">
                          <Camera className="w-6 h-6 text-zinc-500" />
                        </div>
                        <p className="text-zinc-400">
                          <span className="font-semibold text-blue-400">
                            Click to upload
                          </span>{" "}
                          or drag and drop
                        </p>
                        <p className="text-xs text-zinc-500 mt-1">
                          PNG, JPG, or JPEG (Max 2MB)
                        </p>
                      </>
                    )}
                  </label>
                </div>
              </div>

              {/* --- Full Name --- */}
              <div>
                <label
                  htmlFor="fullName"
                  className="block text-sm font-medium text-zinc-400 mb-1"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-zinc-800 border-zinc-700 focus:ring-2 focus:ring-blue-500 focus:outline-none transition rounded-lg px-4 py-2.5 text-white"
                  placeholder="e.g., Bhupendra Jogi"
                />
              </div>

              {/* --- Email (Read-only) --- */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-zinc-400 mb-1"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={profile.email || ""}
                  disabled
                  className="w-full bg-zinc-800 border-zinc-700 rounded-lg px-4 py-2.5 text-zinc-500 cursor-not-allowed"
                />
                <p className="text-xs text-zinc-500 mt-1">
                  Email cannot be changed.
                </p>
              </div>

              {error && <p className="text-sm text-red-400">{error}</p>}

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="px-4 py-1 h-10 cursor-pointer bg-zinc-800 border border-zinc-700 hover:bg-zinc-700 text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 w-fit h-10 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
