import { DocumentsClient } from "../DocumentsClient";

export default async function FolderDocumentsPage({
  params,
}: {
  params: Promise<{ folderId: string }>;
}) {
  const { folderId } = await params;
  const parsedFolderId = Number(folderId);

  return (
    <DocumentsClient
      folderId={parsedFolderId}
    />
  );
}
