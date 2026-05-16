import { auth } from "@/auth";
import { canPublish } from "@/lib/authz";
import { getEditorialStories } from "@/lib/actions/story.actions";
import EditorialClient from "./editorial-client";

export default async function EditorialPage() {
    const session = await auth();
    if (!session?.user) {
        return <EditorialClient access="signedOut" items={[]} />;
    }
    if (!canPublish(session.user.role)) {
        return <EditorialClient access="forbidden" items={[]} />;
    }
    const res = await getEditorialStories();
    const items = res.success && res.data ? res.data : [];

    return <EditorialClient access="ok" items={items} />;
}
