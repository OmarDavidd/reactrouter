import { Form, useLoaderData, useFetcher } from "react-router-dom";
import { getContact, updateContact } from "../contacts";

export async function loader({ params }) {
  const contact = await getContact(params.contactId);
  if (!contact) {
    throw new Response("", {
      status: 404,
      statusText: "Not Found",
    });
  }
  return { contact };
}

export async function action({ request, params }) {
  const formData = await request.formData();
  return updateContact(params.contactId, {
    favorite: formData.get("favorite") === "true",
  });
}

export default function Contact() {
  const { contact } = useLoaderData();

  return (
    <div id="contact" className="p-6">
      <div className="flex items-start gap-6">
        <div className="shrink-0">
          <img
            key={contact.avatar}
            src={
              contact.avatar ||
              `https://robohash.org/${contact.id}.png?size=200x200`
            }
            className="w-70 h-70 border border-gray-200"
          />
        </div>

        <div className="space-y-4">
          <h1 className="text-2xl font-bold">
            {contact.first || contact.last ? (
              <>
                {contact.first} {contact.last}
              </>
            ) : (
              <i>No Name</i>
            )}{" "}
            <Favorite contact={contact} />
          </h1>

          {contact.twitter && (
            <p>
              <a
                target="_blank"
                href={`https://twitter.com/${contact.twitter}`}
                className="text-blue-600 hover:underline"
              >
                {contact.twitter}
              </a>
            </p>
          )}
          {contact.notes && <p className="text-gray-700">{contact.notes}</p>}
          <div className="flex gap-2 pt-2">
            <Form action="edit">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-300 transition-colors"
              >
                Edit
              </button>
            </Form>
            <Form
              method="post"
              action="destroy"
              onSubmit={(event) => {
                if (
                  !confirm("Please confirm you want to delete this record.")
                ) {
                  event.preventDefault();
                }
              }}
            >
              <button
                type="submit"
                className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
              >
                Delete
              </button>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}

function Favorite({ contact }) {
  const fetcher = useFetcher();
  const favorite = fetcher.formData
    ? fetcher.formData.get("favorite") === "true"
    : contact.favorite;
  return (
    <fetcher.Form method="post">
      <button
        name="favorite"
        value={favorite ? "false" : "true"}
        aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
        className="text-2xl focus:outline-none"
      >
        {favorite ? "★" : "☆"}
      </button>
    </fetcher.Form>
  );
}
