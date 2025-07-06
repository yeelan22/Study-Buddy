import { TopBar, SideBar, Footer } from '../Components'

export const Dashboard = () => {
  return (
    <main>
      <TopBar />
      <SideBar />
      <div className="content">
        <h1>Dashboard</h1>
        {/* Add your dashboard content here */}
      </div>
      <Footer />
    </main>
  )
}
