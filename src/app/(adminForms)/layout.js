import Header from "@/components/header/Header";

export default function AdminFormsLayout({ children }) {
  return (
    <>
    <Header/>
    {children}
    </>
  );
}