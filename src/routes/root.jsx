import {
  Outlet,
  NavLink,
  Link,
  useLoaderData,
  Form,
  redirect,
  useNavigation,
  useSubmit,
} from "react-router-dom";
import { getContacts, createContact } from "../contacts";
import { useEffect } from "react";

export async function action() {
  const contact = await createContact();
  return redirect(`/contacts/${contact.id}/edit`);
}

export async function loader({ request }) {
  const url = new URL(request.url);
  const q = url.searchParams.get("q");
  const contacts = await getContacts(q);
  return { contacts, q };
}

export default function Root() {
  const { contacts, q } = useLoaderData();
  const navigation = useNavigation();
  const submit = useSubmit();

  const searching =
    navigation.location &&
    new URLSearchParams(navigation.location.search).has("q");

  useEffect(() => {
    document.getElementById("q").value = q;
  }, [q]);

  return (
    <>
      <div className="flex h-screen bg-gray-50">
        <div
          id="sidebar"
          className="w-80 bg-white border-r border-gray-200 flex flex-col p-4"
        >
          <h1 className="text-xl font-bold text-gray-900 mb-6">
            React Router Contacts
          </h1>
          <div className="space-y-4">
            <form id="search-form" role="search" className="relative">
              <input
                id="q"
                type="search"
                name="q"
                placeholder="Search"
                defaultValue={q}
                className={`w-full px-4 py-2 border border-gray-300 rounded-lg ${
                  searching ? "pr-8" : ""
                }`}
                onChange={(event) => submit(event.currentTarget.form)}
              />
              {searching && (
                <div className="absolute right-3 top-2.5 h-5 w-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
              )}
            </form>
            <Form method="post">
              <button
                type="submit"
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                + New Contact
              </button>
            </Form>
          </div>
          <nav className="mt-6">
            {contacts.length ? (
              <ul className="space-y-1">
                {contacts.map((contact) => (
                  <li key={contact.id}>
                    <NavLink
                      to={`contacts/${contact.id}`}
                      className={({ isActive }) =>
                        `block px-4 py-2 rounded-md ${
                          isActive ? "bg-black text-white" : "hover:bg-gray-100"
                        }`
                      }
                    >
                      {contact.first || contact.last ? (
                        <>
                          {contact.first} {contact.last}
                        </>
                      ) : (
                        <i>No Name</i>
                      )}{" "}
                      {contact.favorite && <span>★</span>}
                    </NavLink>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="px-4 py-2">
                <i>No contacts</i>
              </p>
            )}
          </nav>
        </div>
        <div
          id="detail"
          className={navigation.state === "loading" ? "loading" : ""}
        >
          <Outlet />
        </div>
      </div>
    </>
  );
}
