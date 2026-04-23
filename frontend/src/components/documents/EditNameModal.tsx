"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../common/Button";
import { Input } from "../common/Input";
import { Modal } from "../common/Modal";

const schema = z.object({
  name: z.string().trim().min(1, "Name is required").max(255),
});

type FormValues = z.infer<typeof schema>;

interface EditNameModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialName: string;
  title: string;
  onConfirm: (newName: string) => Promise<void>;
}

export const EditNameModal = ({
  isOpen,
  onClose,
  initialName,
  title,
  onConfirm,
}: EditNameModalProps) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: initialName },
  });

  const [serverError, setServerError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setValue("name", initialName);
      setServerError(null);
    }
  }, [isOpen, initialName, setValue]);

  const onSubmit = async (values: FormValues) => {
    try {
      await onConfirm(values.name);
      onClose();
    } catch (error) {
      setServerError(error instanceof Error ? error.message : "Update failed");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <Input
          label="New name"
          error={errors.name?.message}
          {...register("name")}
          autoFocus
        />
        {serverError && <p className="text-sm font-medium text-red-500">{serverError}</p>}
        <div className="flex justify-end gap-3">
          <Button onClick={onClose} type="button" variant="ghost">
            Cancel
          </Button>
          <Button loading={isSubmitting} type="submit">
            Save Changes
          </Button>
        </div>
      </form>
    </Modal>
  );
};
