import { Form, useLoaderData, redirect, useNavigate } from "react-router-dom";
import { updateContact } from "../contacts";

export async function action({ request, params }) {
  const formData = await request.formData();
  const updates = Object.fromEntries(formData);
  await updateContact(params.contactId, updates);
  return redirect(`/contacts/${params.contactId}`);
}

export default function EditContact() {
  const { contact } = useLoaderData();
  const navigate = useNavigate();

  return (
    <div>
      <Form method="post" id="contact-form" className="p-6 w-full max-w-2xl">
        <div className="grid grid-cols-4 gap-4 items-center">
          <label className="font-medium text-right">Name</label>
          <input
            placeholder="First"
            type="text"
            name="first"
            defaultValue={contact?.first}
            className="col-span-1 px-3 py-2 border border-gray-300 rounded-lg"
          />
          <input
            placeholder="Last"
            type="text"
            name="last"
            defaultValue={contact?.last}
            className="col-span-1 px-3 py-2 border border-gray-300 rounded-lg"
          />
          <div></div>
          <label className="font-medium text-right">Twitter</label>
          <input
            type="text"
            name="twitter"
            placeholder="@jack"
            defaultValue={contact?.twitter}
            className="col-span-3 px-3 py-2 border border-gray-300 rounded-lg"
          />
          <label className="font-medium text-right">Avatar URL</label>
          <input
            placeholder="https://example.com/avatar.jpg"
            type="text"
            name="avatar"
            defaultValue={contact?.avatar}
            className="col-span-3 px-3 py-2 border border-gray-300 rounded-lg"
          />
          <label className="font-medium text-right self-start pt-2">
            Notes
          </label>
          <textarea
            name="notes"
            defaultValue={contact?.notes}
            rows={6}
            className="col-span-3 px-3 py-2 border border-gray-300 rounded-lg"
          />
        </div>
        <div className="flex gap-2 pt-4 justify-end col-span-4">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Save
          </button>
        </div>
      </Form>
      <Form
        method="post"
        action={`/contacts/${contact.id}/destroy`}
        className="px-6 -mt-4"
      >
        <button
          type="submit"
          className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors ml-auto block"
        >
          Cancel
        </button>
      </Form>
    </div>
  );
}
