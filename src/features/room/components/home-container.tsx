"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm, useWatch } from "react-hook-form";

import { createRoomAction } from "@/features/room/actions/create-room";
import { joinRoomAction } from "@/features/room/actions/join-room";
import { HomeScreen } from "@/features/room/components/home-screen";
import { useAnonymousAuth } from "@/shared/hooks/use-anonymous-auth";
import {
  createRoomSchema,
  joinRoomSchema,
  type CreateRoomInput,
  type JoinRoomInput,
} from "@/shared/schemas/room.schema";

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return "Unexpected room error.";
}

export function HomeContainer() {
  const router = useRouter();
  const auth = useAnonymousAuth();
  const [isPending, startTransition] = useTransition();
  const [createError, setCreateError] = useState<string | null>(null);
  const [joinError, setJoinError] = useState<string | null>(null);

  const createForm = useForm<CreateRoomInput>({
    resolver: zodResolver(createRoomSchema),
    defaultValues: {
      name: "",
    },
  });

  const joinForm = useForm<JoinRoomInput>({
    resolver: zodResolver(joinRoomSchema),
    defaultValues: {
      name: "",
      code: "",
    },
  });

  const createName = useWatch({
    control: createForm.control,
    name: "name",
  });

  const joinName = useWatch({
    control: joinForm.control,
    name: "name",
  });

  const joinCode = useWatch({
    control: joinForm.control,
    name: "code",
  });

  const disabled = auth.status !== "ready" || isPending;

  const handleCreate = createForm.handleSubmit((values) => {
    setCreateError(null);

    startTransition(() => {
      void (async () => {
        try {
          const result = await createRoomAction(values);
          router.push(`/room/${result.code}`);
        } catch (error) {
          setCreateError(getErrorMessage(error));
        }
      })();
    });
  });

  const handleJoin = joinForm.handleSubmit((values) => {
    setJoinError(null);

    startTransition(() => {
      void (async () => {
        try {
          const result = await joinRoomAction(values);
          router.push(`/room/${result.code}`);
        } catch (error) {
          setJoinError(getErrorMessage(error));
        }
      })();
    });
  });

  return (
    <HomeScreen
      authError={auth.error}
      authStatus={auth.status}
      createError={createError}
      createName={createName ?? ""}
      disabled={disabled}
      joinCode={joinCode ?? ""}
      joinError={joinError}
      joinName={joinName ?? ""}
      onCreateNameChange={(value) => {
        createForm.setValue("name", value, {
          shouldDirty: true,
          shouldTouch: true,
          shouldValidate: true,
        });
      }}
      onCreateSubmit={handleCreate}
      onJoinCodeChange={(value) => {
        joinForm.setValue("code", value.toUpperCase(), {
          shouldDirty: true,
          shouldTouch: true,
          shouldValidate: true,
        });
      }}
      onJoinNameChange={(value) => {
        joinForm.setValue("name", value, {
          shouldDirty: true,
          shouldTouch: true,
          shouldValidate: true,
        });
      }}
      onJoinSubmit={handleJoin}
    />
  );
}
