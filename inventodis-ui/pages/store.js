import { Table, Card, Space, BackTop, Row, Col, Input } from "antd";
import { PushpinOutlined } from "@ant-design/icons";

import api from "../shared/api";
import { useEffect, useState } from "react";
import ModalInventory from "../components/ModalInventory";
import { debounceFn } from "../shared/utils";

const columns = ({ onView }) => [
  {
    title: "ID",
    key: "entityId",
    render: (_, row) => row.entityId,
  },
  {
    title: "Address",
    key: "address",
    render: (_, row) => row.address,
  },
  {
    title: "City",
    key: "city",
    render: (_, row) => row.city,
  },
  {
    title: "Country",
    key: "country",
    render: (_, row) => row.country,
  },
  {
    title: "Description",
    key: "description",
    render: (_, row) => row.description,
  },
  {
    title: "Action",
    key: "action",
    fixed: "right",
    width: 200,
    render: (_, row) => {
      return (
        <Space size="middle">
          <PushpinOutlined
            style={{ fontSize: 16, color: "blue" }}
            onClick={() => onView(row.entityId)}
          />
        </Space>
      );
    },
  },
];

const initPagination = {
  current: 1,
  pageSize: 20,
};

export default function Store() {
  const [stores, setStores] = useState([]);
  const [pagination, setPagination] = useState(initPagination);
  const [loading, setLoading] = useState(false);
  const [storeId, setStoreId] = useState(null);
  const [isShowInventory, setIsShowInventory] = useState(false);

  const [keyword, setKeyword] = useState("");

  const fetchData = async ({ page, page_size }) => {
    try {
      const query = {
        page: page || 1,
        page_size: page_size || 20,
      };
      if (keyword) {
        query.keyword = keyword;
      }

      setLoading(true);

      const res = await api.getStores(query);

      setPagination({
        current: res.pagination.page,
        pageSize: res.pagination.page_size,
        total: res.pagination.total,
      });

      setStores(res.data);

      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData({});
  }, [keyword]);

  const paginationProps = {
    showSizeChanger: true,
    onChange: (page, page_size) => fetchData({ page, page_size }),
    ...pagination,
  };
  const handleView = (id) => {
    setStoreId(id);
    setIsShowInventory(true);
  };

  return (
    <>
      <Card>
        <Row
          style={{ marginBottom: 24 }}
          justify="space-between"
          align="bottom"
        >
          <Col span={6}>
            <label>Tìm kiếm</label>
            <Input
              style={{ width: "100%", marginTop: 4 }}
              placeholder="Input"
              onChange={debounceFn(setKeyword)}
            />
          </Col>
        </Row>
        <Table
          rowKey="entityId"
          dataSource={stores}
          columns={columns({ onView: handleView })}
          pagination={paginationProps}
          loading={loading}
        />
      </Card>
      {isShowInventory && (
        <ModalInventory
          storeId={storeId}
          onCancel={() => {
            setIsShowInventory(false);
          }}
        />
      )}
      <BackTop />
    </>
  );
}
