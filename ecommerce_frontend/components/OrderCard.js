export default function OrderCard({ order }) {
  return (
    <div className="bg-white rounded shadow p-4">
      <div className="flex justify-between">
        <div>
          <div className="text-sm text-gray-500">Order #{order.id}</div>
          <div className="font-semibold">Status: {order.status}</div>
        </div>
        <div className="font-bold">Total: ${order.total_price}</div>
      </div>
      <ul className="mt-3 text-sm list-disc pl-4">
        {order.items?.map(it => (
          <li key={it.id}>{it.product_name} x {it.quantity} @ ${it.price}</li>
        ))}
      </ul>
    </div>
  );
}
