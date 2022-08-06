import { Layout, Menu } from "antd";
import { SearchOutlined, AppstoreOutlined } from "@ant-design/icons";

import Head from "next/head";
const { Header } = Layout;
import { useRouter } from "next/router";

export default function TheLayout({ children }) {
  const router = useRouter();

  return (
    <div>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Layout>
        <Header>
          <Menu
            theme="dark"
            mode="horizontal"
            defaultOpenKeys={["store"]}
            defaultSelectedKeys={["store"]}
            // items={[
            //   { key: "store", label: "Store" },
            //   { key: "map", label: "Map" },
            // ]}
            onSelect={(info) => {
              router.push(`/${info.key}`);
            }}
          >
            <Menu.Item key="store" icon={<AppstoreOutlined />}>
              Store
            </Menu.Item>
            <Menu.Item key="map" icon={<SearchOutlined />}>
              Map
            </Menu.Item>
          </Menu>
        </Header>
        <main>{children}</main>
      </Layout>
    </div>
  );
}
