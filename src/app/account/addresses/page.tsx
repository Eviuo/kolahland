import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { AddressesManager } from "@/components/account/addresses-manager";

export default async function AddressesPage() {
  const session = await auth();
  const addresses = await prisma.address.findMany({
    where: { userId: session!.user.id },
    orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
  });

  return <AddressesManager addresses={addresses} />;
}
