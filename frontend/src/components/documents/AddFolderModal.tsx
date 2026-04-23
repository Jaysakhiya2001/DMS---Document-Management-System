"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { createFolder } from "@/services/folders.service";
import { addFolderSchema } from "@/utils/validators";
import { Button } from "../common/Button";
import { Input } from "../common/Input";
import { Modal } from "../common/Modal";

type FormValues = z.infer<typeof addFolderSchema>;

export const AddFolderModal = ({
  isOpen,
  onClose,
  parentId,
  onSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  parentId: number | null;
  onSuccess: () => void;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(addFolderSchema) });

  const [serverError, setServerError] = useState<string | null>(null);

  const onSubmit = async (values: FormValues) => {
    setServerError(null);
    try {
      await createFolder({ name: values.name, parent_id: parentId });
      onSuccess();
      onClose();
    } catch (error) {
      setServerError(error instanceof Error ? error.message : "Failed to create folder");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add new folder">
      <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
        <Input label="Folder name" error={errors.name?.message} {...register("name")} />
        {serverError && <p className="text-sm font-medium text-red-500">{serverError}</p>}
        <div className="flex justify-end">
          <Button loading={isSubmitting} type="submit">
            Create Folder
          </Button>
        </div>
      </form>
    </Modal>
  );
};
