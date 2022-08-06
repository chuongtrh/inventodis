import { Table, Space, Modal } from "antd";
import Image from "next/image";
import { ShoppingCartOutlined } from "@ant-design/icons";
import api from "../shared/api";
import { useEffect, useState } from "react";

import SocketIOClient from "socket.io-client";

const getColorAvailable = (num) => {
  if (num > 50) return "green";
  if (num > 10) return "orange";
  if (num > 0) return "red";
  return "black";
};

export default function ModalInventory({ storeId, onCancel }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const [connected, setConnected] = useState(false);
  const [cart, setCart] = useState({});
  const [socket, setSocket] = useState(null);

  const columns = ({ onAddCart }) => [
    {
      title: "SKU",
      key: "entityId",
      render: (_, row) => row.sku.entityId,
    },
    {
      title: "Name",
      key: "name",
      render: (_, row) => (
        <div className="h-stack h-stack-sm">
          <Image
            loader={({ src }) => src}
            src={row.sku.icon}
            alt={row.sku.name}
            width={50}
            height={50}
          />
          <span> {row.sku.name}</span>
        </div>
      ),
    },
    {
      title: "Available to Promise",
      key: "availableToPromise",
      render: (_, row) => (
        <div
          style={{
            backgroundColor: getColorAvailable(
              row.inventory.availableToPromise
            ),
            height: 40,
          }}
        >
          <span style={{ color: "white" }}>
            {row.inventory.availableToPromise}
          </span>
        </div>
      ),
    },
    {
      title: "OnHand",
      key: "onHand",
      render: (_, row) => row.inventory.onHand,
    },

    {
      title: "Allocated",
      key: "allocated",
      render: (_, row) => row.inventory.allocated,
    },
    {
      title: "Reserved",
      key: "reserved",
      render: (_, row) => row.inventory.reserved,
    },
    {
      title: "VirtualHold",
      key: "virtualHold",
      render: (_, row) => row.inventory.virtualHold,
    },
    {
      title: "Action",
      key: "action",
      fixed: "right",
      width: 200,
      render: (_, row) => {
        return (
          <Space size="middle">
            <ShoppingCartOutlined
              style={{ fontSize: 32, color: "blue" }}
              onClick={() =>
                onAddCart({
                  sku: row.sku.entityId,
                  inventory: row.inventory,
                })
              }
            />
            {cart[row.sku.entityId]}
          </Space>
        );
      },
    },
  ];

  useEffect(() => {
    const socket = SocketIOClient(process.env.NEXT_PUBLIC_API_SERVER);
    // log socket connection
    socket.on("connect", () => {
      setConnected(true);
      setSocket(socket);
    });

    // socket disconnet onUnmount if exists
    if (socket) return () => socket.disconnect();
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      const res = await api.getStoreInventory(storeId);
      setProducts(res.data.skus);

      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!socket) return;

    socket.on("update:inventory", (payload) => {
      if (payload.storeId !== `${storeId}`) return;

      const { sku, inventory } = payload;

      let p = products.find((p) => {
        return p.id == sku;
      });

      p.inventory = { ...inventory };

      if (cart[sku]) {
        cart[sku]++;
      } else {
        cart[sku] = 1;
      }
      setCart({ ...cart });
    });
  }, [products, cart, storeId, socket]);

  const onAddCart = ({ sku, inventory }) => {
    if (inventory.availableToPromise > 0) {
      if (connected) {
        const data = { storeId, sku, inventoryId: inventory.entityId };
        socket.emit("addCart", data);
      }
    }
  };
  return (
    <Modal
      title={
        <h2>
          Store: #{storeId} {connected ? "connected" : "disconnected"}
        </h2>
      }
      width={"85%"}
      footer={null}
      visible={true}
      onCancel={() => {
        setCart({});
        if (onCancel) onCancel();
        if (socket) {
          socket.disconnect();
        }
      }}
    >
      <Table
        rowKey={(row) => row.sku.entityId}
        dataSource={products}
        loading={loading}
        columns={columns({ onAddCart })}
      />
    </Modal>
  );
}
