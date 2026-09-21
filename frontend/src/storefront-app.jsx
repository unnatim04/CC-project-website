import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Search,
  Heart,
  ShoppingBag,
  Menu,
  X,
  ChevronRight,
  Minus,
  Plus,
  Trash2,
  Star,
  SlidersHorizontal,
  ArrowRight,
  UserRound,
} from "lucide-react";
import { products, brands, categories } from "./data/product-catalog";
import "./styles.css";

const money = (n) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
const store = (key, fallback) => {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
};

function App() {
  const [page, setPage] = useState("home"),
    [query, setQuery] = useState(""),
    [brand, setBrand] = useState("All"),
    [cat, setCat] = useState("All"),
    [sort, setSort] = useState("featured"),
    [minRating, setMinRating] = useState(0),
    [price, setPrice] = useState(6000),
    [cart, setCart] = useState(() => store("muse-cart", [])),
    [wish, setWish] = useState(() => store("muse-wishlist", [])),
    [drawer, setDrawer] = useState(false),
    [menu, setMenu] = useState(false),
    [user, setUser] = useState(() => store("muse-user", null)),
    [toast, setToast] = useState(""),
    [catalog, setCatalog] = useState(products),
    [detail, setDetail] = useState(null);
  useEffect(
    () => localStorage.setItem("muse-cart", JSON.stringify(cart)),
    [cart],
  );
  useEffect(
    () => localStorage.setItem("muse-wishlist", JSON.stringify(wish)),
    [wish],
  );
  useEffect(
    () => localStorage.setItem("muse-user", JSON.stringify(user)),
    [user],
  );
  useEffect(() => {
    const url = import.meta.env.VITE_API_URL;
    if (url)
      fetch(`${url}/api/products`)
        .then((r) => (r.ok ? r.json() : Promise.reject()))
        .then((data) => data.length === 20 && setCatalog(data))
        .catch(() => {});
  }, []);
  useEffect(() => {
    const button = document.querySelector(".hero-copy .button");
    if (!button) return;
    const resetShopFilters = () => {
      setBrand("All");
      setCat("All");
      setQuery("");
    };
    button.addEventListener("click", resetShopFilters);
    return () => button.removeEventListener("click", resetShopFilters);
  }, []);
  const notify = (t) => {
    setToast(t);
    setTimeout(() => setToast(""), 2600);
  };
  const filtered = useMemo(
    () =>
      catalog
        .filter((p) => {
          const hay = [
            p.name,
            p.brand,
            p.category,
            ...p.shades.map((s) => s.name),
          ]
            .join(" ")
            .toLowerCase();
          return (
            hay.includes(query.toLowerCase()) &&
            (brand === "All" || p.brand === brand) &&
            (cat === "All" || p.category === cat) &&
            p.price <= price &&
            p.rating >= minRating
          );
        })
        .sort((a, b) =>
          sort === "low"
            ? a.price - b.price
            : sort === "high"
              ? b.price - a.price
              : sort === "rating"
                ? b.rating - a.rating
                : sort === "new"
                  ? b.new === a.new
                    ? 0
                    : b.new
                      ? 1
                      : -1
                  : a.featured - b.featured,
        ),
    [catalog, query, brand, cat, price, minRating, sort],
  );
  const add = (p, shade, qty = 1) => {
    if (!shade) {
      notify("Please select a shade.");
      return false;
    }
    setCart((c) => {
      let i = c.findIndex((x) => x.id === p.id && x.shade.name === shade.name);
      return i < 0
        ? [...c, { ...p, shade, qty }]
        : c.map((x, j) => (j === i ? { ...x, qty: x.qty + qty } : x));
    });
    notify(`${p.name} added to your bag`);
    return true;
  };
  const quantity = (key, d) =>
    setCart((c) =>
      c.map((x) =>
        x.id + x.shade.name === key ? { ...x, qty: Math.max(1, x.qty + d) } : x,
      ),
    );
  const remove = (key) =>
    setCart((c) => c.filter((x) => x.id + x.shade.name !== key));
  const subtotal = cart.reduce((n, x) => n + x.price * x.qty, 0),
    shipping = subtotal ? 99 : 0;
  return (
    <>
      <Header
        {...{
          page,
          setPage,
          setQuery,
          query,
          cart,
          wish,
          setDrawer,
          menu,
          setMenu,
          user,
          setUser,
        }}
      />
      <main>
        {page === "home" ? (
          <Home
            {...{
              setPage,
              setBrand,
              products: catalog,
              setDetail,
              add,
              wish,
              setWish,
            }}
          />
        ) : page === "shop" ? (
          <Shop
            {...{
              filtered,
              query,
              setQuery,
              brand,
              setBrand,
              cat,
              setCat,
              sort,
              setSort,
              minRating,
              setMinRating,
              price,
              setPrice,
              setDetail,
              add,
              wish,
              setWish,
            }}
          />
        ) : page === "wishlist" ? (
          <Wishlist {...{ wish, setWish, setDetail, add, products: catalog }} />
        ) : page === "checkout" ? (
          <Checkout
            cart={cart}
            total={subtotal + shipping}
            setCart={setCart}
            setPage={setPage}
            user={user}
            notify={notify}
          />
        ) : page === "shipping" ? (
          <Shipping setPage={setPage} />
        ) : page === "about" ? (
          <About setPage={setPage} />
        ) : page === "profile" ? (
          <Profile user={user} setUser={setUser} setPage={setPage} />
        ) : (
          <Auth
            user={user}
            setUser={setUser}
            setPage={setPage}
            notify={notify}
          />
        )}
      </main>
      <Footer setPage={setPage} />
      <CartDrawer
        open={drawer}
        close={() => setDrawer(false)}
        cart={cart}
        quantity={quantity}
        remove={remove}
        subtotal={subtotal}
        shipping={shipping}
        setPage={setPage}
      />
      {detail && (
        <ProductModal
          p={detail}
          close={() => setDetail(null)}
          add={add}
          wish={wish}
          setWish={setWish}
        />
      )}{" "}
      {toast && <div className="toast">{toast}</div>}
    </>
  );
}

function Header({
  page,
  setPage,
  setQuery,
  query,
  cart,
  wish,
  setDrawer,
  menu,
  setMenu,
  user,
  setUser,
}) {
  const go = (p) => {
    setPage(p);
    setMenu(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const goNewArrivals = () => {
    setPage("home");
    setMenu(false);
    setTimeout(
      () =>
        document
          .querySelector("#new-arrivals")
          ?.scrollIntoView({ behavior: "smooth" }),
      0,
    );
  };
  const goBrands = () => {
    setPage("home");
    setMenu(false);
    setTimeout(
      () =>
        document
          .querySelector(".brands")
          ?.scrollIntoView({ behavior: "smooth" }),
      0,
    );
  };
  const goBestSellers = () => {
    setPage("home");
    setMenu(false);
    setTimeout(
      () =>
        document
          .querySelector("#most-loved")
          ?.scrollIntoView({ behavior: "smooth" }),
      0,
    );
  };
  const goSupport = () => {
    setPage("home");
    setMenu(false);
    setTimeout(
      () =>
        document
          .querySelector("#support")
          ?.scrollIntoView({ behavior: "smooth" }),
      0,
    );
  };
  const goAccount = () => (user ? go("profile") : go("auth"));
  return (
    <header>
      <div className="announcement">
        COMPLIMENTARY DELIVERY ON BEAUTY EDITS OVER ₹3,000
      </div>
      <nav>
        <button className="icon mobile" onClick={() => setMenu(!menu)}>
          {menu ? <X /> : <Menu />}
        </button>
        <button className="logo" onClick={() => go("home")}>
          LUMA
        </button>
        <div className={"links " + (menu ? "open" : "")}>
          <button onClick={() => go("home")}>Home</button>
          <button onClick={() => go("shop")}>Shop</button>
          <button onClick={goBrands}>Brands</button>
          <button onClick={goNewArrivals}>New Arrivals</button>
          <button onClick={goBestSellers}>Best Sellers</button>
          <button onClick={goSupport}>Support</button>
        </div>
        <div className="actions">
          <label className="search">
            <Search size={17} />
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                if (page !== "shop") go("shop");
              }}
              placeholder="Search"
            />
          </label>
          <button className="icon" onClick={() => go("wishlist")}>
            <Heart size={19} />
            {wish.length > 0 && <b>{wish.length}</b>}
          </button>
          <button className="icon" onClick={goAccount}>
            <UserRound size={19} />
          </button>
          <button className="icon" onClick={() => setDrawer(true)}>
            <ShoppingBag size={19} />
            {cart.reduce((n, x) => n + x.qty, 0) > 0 && (
              <b>{cart.reduce((n, x) => n + x.qty, 0)}</b>
            )}
          </button>
        </div>
      </nav>
    </header>
  );
}
function Home({ setPage, setBrand, products, setDetail, add, wish, setWish }) {
  const openBrand = (b) => {
    setBrand(b);
    setPage("shop");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">THE MODERN BEAUTY CABINET</p>
          <h1>
            Beauty,
            <br />
            <em>Curated.</em>
          </h1>
          <p>
            Discover iconic makeup from the world’s most coveted beauty houses.
          </p>
          <button className="button dark" onClick={() => setPage("shop")}>
            SHOP COLLECTION <ArrowRight size={16} />
          </button>
        </div>
      </section>
      <section className="intro">
        <p className="eyebrow">A CONSIDERED EDIT</p>
        <h2>Four houses. One beautiful ritual.</h2>
        <p>
          From artist-led icons to complexion innovation, explore beauty with a
          point of view.
        </p>
      </section>
      <section className="brands section">
        <div className="section-title">
          <div>
            <p className="brand-heading">Brands</p>
          </div>
          <button className="text-button" onClick={() => setPage("shop")}>
            VIEW ALL <ChevronRight />
          </button>
        </div>
        <div className="brand-grid">
          {brands.map((b, i) => (
            <article
              className={"brand-card b" + i}
              key={b.name}
              onClick={() => openBrand(b.name)}
            >
              <div>
                <p>0{i + 1}</p>
                <h3>{b.name}</h3>
                <span>{b.description}</span>
                <button onClick={() => openBrand(b.name)}>
                  SHOP BRAND <ArrowRight size={15} />
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
      <ProductStrip
        title="New arrivals"
        sub="FRESH IN THE EDIT"
        items={products.filter((x) => x.new)}
        {...{ setDetail, add, wish, setWish }}
      />
      <section className="quote" id="about">
        <p>
          “Luxury is the quiet confidence of choosing beauty that feels entirely
          your own.”
        </p>
        <span>— THE LUMA PHILOSOPHY</span>
      </section>
      <ProductStrip
        title="Most loved"
        sub="THE ICONS"
        items={products.filter((x) => x.best)}
        {...{ setDetail, add, wish, setWish }}
      />
    </>
  );
}
function ProductStrip({ title, sub, items, ...props }) {
  return (
    <section
      className="section"
      id={
        title === "New arrivals"
          ? "new-arrivals"
          : title === "Most loved"
            ? "most-loved"
            : undefined
      }
    >
      <div className="section-title">
        <div>
          <p className="eyebrow">{sub}</p>
          <h2>{title}</h2>
        </div>
        <button className="text-button">
          DISCOVER <ChevronRight />
        </button>
      </div>
      <div className="product-grid">
        {items.slice(0, 4).map((p) => (
          <ProductCard key={p.id} p={p} {...props} />
        ))}
      </div>
    </section>
  );
}
function ProductCard({ p, setDetail, add, wish, setWish }) {
  const [shade, setShade] = useState(null),
    loved = wish.includes(p.id);
  return (
    <article
      className="product"
      onClick={() => setDetail(p)}
      role="button"
      tabIndex="0"
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") setDetail(p);
      }}
    >
      <div className="product-photo">
        <img
          src={p.image}
          alt={`${p.brand} ${p.name}`}
          onError={(e) => (e.currentTarget.src = "/assets/editorial-hero.png")}
        />
        {p.new && <span className="badge">NEW</span>}
        {p.best && <span className="badge">BEST SELLER</span>}
        <button
          className={"heart " + (loved ? "active" : "")}
          onClick={(e) => {
            e.stopPropagation();
            setWish((w) =>
              loved ? w.filter((id) => id !== p.id) : [...w, p.id],
            );
          }}
        >
          <Heart fill={loved ? "currentColor" : "none"} />
        </button>
      </div>
      <p className="brand-name">{p.brand}</p>
      <h3>{p.name}</h3>
      <p className="category">
        {p.category} · <span>★ {p.rating}</span>
      </p>
      <div className="card-bottom">
        <strong>{money(p.price)}</strong>
        <div className="swatches small">
          {p.shades.map((s) => (
            <button
              aria-label={s.name}
              key={s.name}
              style={{ background: s.hex }}
              className={shade?.name === s.name ? "selected" : ""}
              onClick={(e) => {
                e.stopPropagation();
                setShade(s);
              }}
            />
          ))}
        </div>
      </div>
      <div className="card-actions">
        <button
          className="dark"
          onClick={(e) => {
            e.stopPropagation();
            add(p, shade);
          }}
        >
          ADD TO BAG
        </button>
      </div>
    </article>
  );
}
function Shop({
  filtered,
  query,
  setQuery,
  brand,
  setBrand,
  cat,
  setCat,
  sort,
  setSort,
  minRating,
  setMinRating,
  price,
  setPrice,
  ...props
}) {
  return (
    <section className="shop section">
      <p className="eyebrow">THE COMPLETE EDIT</p>
      <h1>
        Discover your next <em>essential.</em>
      </h1>
      <div className="shopbar">
        <label>
          <Search size={18} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products, brands, categories or shades"
          />
        </label>
        <select value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="featured">Featured</option>
          <option value="low">Price: Low to High</option>
          <option value="high">Price: High to Low</option>
          <option value="rating">Rating</option>
          <option value="new">Newest</option>
        </select>
      </div>
      <div className="shop-layout">
        <aside>
          <h3>
            <SlidersHorizontal size={16} /> Refine
          </h3>
          <Filter
            title="Brand"
            vals={["All", ...brands.map((x) => x.name)]}
            current={brand}
            change={setBrand}
          />
          <Filter
            title="Category"
            vals={["All", ...categories]}
            current={cat}
            change={setCat}
          />
          <div className="filter">
            <h4>
              Max price <span>{money(price)}</span>
            </h4>
            <input
              type="range"
              min="1000"
              max="6000"
              step="250"
              value={price}
              onChange={(e) => setPrice(+e.target.value)}
            />
          </div>
          <div className="filter">
            <h4>Minimum rating</h4>
            {[4.8, 4.5, 4].map((r) => (
              <button
                className={minRating === r ? "chosen" : ""}
                key={r}
                onClick={() => setMinRating(minRating === r ? 0 : r)}
              >
                ★ {r} & up
              </button>
            ))}
          </div>
        </aside>
        <div>
          <p className="result-count">{filtered.length} beauty finds</p>
          <div className="product-grid">
            {filtered.map((p) => (
              <ProductCard key={p.id} p={p} {...props} />
            ))}
          </div>
          {!filtered.length && (
            <div className="empty">
              <h2>No beauty finds yet.</h2>
              <p>Try another search.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
function Filter({ title, vals, current, change }) {
  return (
    <div className="filter">
      <h4>{title}</h4>
      {vals.map((v) => (
        <button
          className={current === v ? "chosen" : ""}
          onClick={() => change(v)}
          key={v}
        >
          {v}
        </button>
      ))}
    </div>
  );
}
function ProductModal({ p, close, add, wish, setWish }) {
  const [shade, setShade] = useState(null),
    [qty, setQty] = useState(1),
    [tab, setTab] = useState("Details"),
    loved = wish.includes(p.id);
  const purchase = () => {
    if (add(p, shade, qty)) close();
  };
  return (
    <div className="overlay" onMouseDown={close}>
      <div className="modal" onMouseDown={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={close}>
          <X />
        </button>
        <div className="modal-image">
          <img
            src={p.image}
            alt={p.name}
            onError={(e) => (e.currentTarget.src = "/assets/editorial-hero.png")}
          />
        </div>
        <div className="modal-content">
          <p className="brand-name">{p.brand}</p>
          <h2>{p.name}</h2>
          <p className="stars">
            ★★★★★ <span>{p.rating} · 124 reviews</span>
          </p>
          <h3>{money(p.price)}</h3>
          <p>{p.description}</p>
          <div className="shade-label">
            SHADE <strong>{shade?.name || "Choose your shade"}</strong>
          </div>
          <div className="swatches">
            {p.shades.map((s) => (
              <button
                title={s.name}
                key={s.name}
                style={{ background: s.hex }}
                className={shade?.name === s.name ? "selected" : ""}
                onClick={() => setShade(s)}
              />
            ))}
          </div>
          <div className="purchase">
            <div className="quantity">
              <button onClick={() => setQty(Math.max(1, qty - 1))}>
                <Minus />
              </button>
              <span>{qty}</span>
              <button onClick={() => setQty(qty + 1)}>
                <Plus />
              </button>
            </div>
            <button className="button dark" onClick={purchase}>
              ADD TO BAG
            </button>
            <button
              className={"outline-heart " + (loved ? "active" : "")}
              onClick={() =>
                setWish((w) =>
                  loved ? w.filter((id) => id !== p.id) : [...w, p.id],
                )
              }
            >
              <Heart fill={loved ? "currentColor" : "none"} />
            </button>
          </div>
          <div className="tabs">
            {["Details", "Ingredients", "Reviews"].map((t) => (
              <button
                className={tab === t ? "selected" : ""}
                onClick={() => setTab(t)}
                key={t}
              >
                {t}
              </button>
            ))}
          </div>
          <div className="tabcopy">
            {tab === "Reviews" ? (
              p.reviews.map((r) => (
                <p key={r.name}>
                  <b>★★★★★ {r.name}</b>
                  <br />
                  {r.text}
                  <small>{r.date}</small>
                </p>
              ))
            ) : tab === "Ingredients" ? (
              <p>
                Skin-loving emollients, refined pigments and conditioning
                botanical extracts. Formulated for a beautiful, comfortable
                finish.
              </p>
            ) : (
              <p>
                <b>Benefits</b>
                <br />
                Buildable colour · comfortable wear · photographed beautifully.{" "}
                {p.category} made for your everyday ritual.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
function CartDrawer({
  open,
  close,
  cart,
  quantity,
  remove,
  subtotal,
  shipping,
  setPage,
}) {
  return (
    <div className={"cart-wrap " + (open ? "show" : "")}>
      <div className="scrim" onClick={close} />
      <aside className="cart">
        <button className="modal-close" onClick={close}>
          <X />
        </button>
        <p className="eyebrow">YOUR BEAUTY EDIT</p>
        <h2>
          Shopping bag <small>({cart.reduce((n, x) => n + x.qty, 0)})</small>
        </h2>
        {cart.length ? (
          <>
            <div className="cart-items">
              {cart.map((x) => (
                <div className="cart-item" key={x.id + x.shade.name}>
                  <img
                    src={x.image}
                    alt={`${x.brand} ${x.name}`}
                    onError={(e) => (e.currentTarget.src = "/assets/editorial-hero.png")}
                  />
                  <div>
                    <p className="brand-name">{x.brand}</p>
                    <h4>{x.name}</h4>
                    <small>Shade: {x.shade.name}</small>
                    <strong>{money(x.price)}</strong>
                    <div className="qty-mini">
                      <button onClick={() => quantity(x.id + x.shade.name, -1)}>
                        <Minus />
                      </button>
                      {x.qty}
                      <button onClick={() => quantity(x.id + x.shade.name, 1)}>
                        <Plus />
                      </button>
                      <button onClick={() => remove(x.id + x.shade.name)}>
                        <Trash2 />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="totals">
              <p>
                Subtotal <span>{money(subtotal)}</span>
              </p>
              <p>
                Estimated shipping <span>{money(shipping)}</span>
              </p>
              <p className="grand">
                Total <span>{money(subtotal + shipping)}</span>
              </p>
              <button
                className="button dark"
                onClick={() => {
                  close();
                  setPage("checkout");
                }}
              >
                SECURE CHECKOUT
              </button>
            </div>
          </>
        ) : (
          <div className="empty">
            <ShoppingBag />
            <h3>Your bag is waiting.</h3>
            <p>Collect the pieces you love.</p>
          </div>
        )}
      </aside>
    </div>
  );
}
function Wishlist({ wish, setWish, setDetail, add, products }) {
  const items = products.filter((p) => wish.includes(p.id));
  return (
    <section className="section wishlist">
      <p className="eyebrow">SAVED FOR LATER</p>
      <h1>
        Your beauty <em>wishlist.</em>
      </h1>
      {items.length ? (
        <div className="product-grid">
          {items.map((p) => (
            <ProductCard
              key={p.id}
              p={p}
              {...{ setDetail, add, wish, setWish }}
            />
          ))}
        </div>
      ) : (
        <div className="empty">
          <Heart />
          <h2>Your wishlist is quiet.</h2>
          <p>Tap the heart on a beauty find to save it here.</p>
        </div>
      )}
    </section>
  );
}
function Checkout({ cart, total, setCart, setPage, user, notify }) {
  const [sent, setSent] = useState(false),
    [saving, setSaving] = useState(false),
    [orderNumber, setOrderNumber] = useState(""),
    [payment, setPayment] = useState("Card"),
    [form, setForm] = useState({
      name: user?.name || "",
      email: user?.email || "",
      phone: "",
      address: "",
      city: "",
      state: "",
      pin: "",
      country: "India",
    });
  const submit = async (e) => {
    e.preventDefault();
    if (!cart.length) return;
    setSaving(true);
    const subtotal = cart.reduce((sum, x) => sum + x.price * x.qty, 0);
    try {
      const base = import.meta.env.VITE_API_URL || "";
      const res = await fetch(`${base}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: form,
          paymentMethod: payment,
          items: cart.map((x) => ({
            productId: x.id,
            productName: x.name,
            brand: x.brand,
            shadeName: x.shade.name,
            quantity: x.qty,
            price: x.price,
          })),
          subtotal,
          shipping: 99,
          total,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setOrderNumber(data.orderNumber);
      setSent(true);
      setCart([]);
    } catch {
      notify("Order saved in demo mode. Start the API to store it in MongoDB.");
      setOrderNumber(`MM-${Date.now().toString().slice(-7)}`);
      setSent(true);
      setCart([]);
    } finally {
      setSaving(false);
    }
  };
  if (sent)
    return (
      <section className="confirmation">
        <p className="eyebrow">ORDER CONFIRMED</p>
        <h1>
          Your beauty edit is <em>confirmed.</em>
        </h1>
        <p>
          Thank you, {form.name || "beautiful"}. Your demonstration order{" "}
          <b>{orderNumber}</b> is being prepared.
        </p>
        <p>Estimated delivery: 3–5 business days · {money(total)}</p>
        <button className="button dark" onClick={() => setPage("home")}>
          RETURN TO LUMA
        </button>
      </section>
    );
  return (
    <section className="checkout section">
      <p className="eyebrow">SECURE DEMO CHECKOUT</p>
      <h1>
        One step closer to <em>your edit.</em>
      </h1>
      <div className="checkout-grid">
        <form onSubmit={submit}>
          <h3>Customer information</h3>
          {[
            ["name", "Full Name"],
            ["email", "Email"],
            ["phone", "Phone Number"],
            ["address", "Address"],
            ["city", "City"],
            ["state", "State"],
            ["pin", "PIN Code"],
            ["country", "Country"],
          ].map(([k, l]) => (
            <label key={k}>
              {l}
              <input
                required
                value={form[k]}
                onChange={(e) => setForm({ ...form, [k]: e.target.value })}
              />
            </label>
          ))}
          <h3>Payment method</h3>
          <div className="payments">
            {["Card", "UPI", "Cash on Delivery"].map((x) => (
              <label key={x}>
                <input
                  type="radio"
                  checked={payment === x}
                  onChange={() => setPayment(x)}
                />
                {x}
              </label>
            ))}
          </div>
          <button className="button dark" disabled={saving}>
            {saving ? "SAVING ORDER…" : "PLACE DEMO ORDER"}
          </button>
        </form>
        <aside className="order-summary">
          <h3>Your order</h3>
          {cart.map((x) => (
            <p key={x.id + x.shade.name}>
              {x.name}{" "}
              <small>
                {x.shade.name} × {x.qty}
              </small>
              <span>{money(x.price * x.qty)}</span>
            </p>
          ))}
          <hr />
          <p className="grand">
            Total <span>{money(total)}</span>
          </p>
          <small>Demo checkout only. No payment is processed.</small>
        </aside>
      </div>
    </section>
  );
}
function Auth({ user, setUser, setPage, notify }) {
  const [signup, setSignup] = useState(false),
    [saving, setSaving] = useState(false),
    [form, setForm] = useState({ name: "", email: "", password: "" });
  if (user)
    return (
      <section className="confirmation">
        <h1>
          Welcome back, <em>{user.name}.</em>
        </h1>
        <button
          className="button dark"
          onClick={() => {
            setUser(null);
            setPage("home");
          }}
        >
          LOG OUT
        </button>
      </section>
    );
  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const base = import.meta.env.VITE_API_URL || "";
      const path = signup ? "/api/auth/register" : "/api/auth/login";
      const body = signup
        ? form
        : { email: form.email, password: form.password };
      const response = await fetch(`${base}${path}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Authentication failed.");
      setUser(data.user);
      notify(signup ? "Your account was created." : "You are signed in.");
      setPage("home");
    } catch (error) {
      notify(error.message);
    } finally {
      setSaving(false);
    }
  };
  return (
    <section className="auth">
      <h1>
        {signup ? "Create your" : "Welcome"} <em>account.</em>
      </h1>
      <form onSubmit={submit}>
        {signup && (
          <label>
            Full Name
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </label>
        )}
        <label>
          Email
          <input
            required
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </label>
        <label>
          Password
          <input
            required
            type="password"
            minLength="4"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </label>
        <button className="button dark" disabled={saving}>
          {saving ? "PLEASE WAIT..." : signup ? "CREATE ACCOUNT" : "SIGN IN"}
        </button>
      </form>
      <button className="text-button" onClick={() => setSignup(!signup)}>
        {signup ? "Already a member? Sign in" : "New here? Create an account"}
      </button>
    </section>
  );
}
function Shipping({ setPage }) {
  return (
    <section className="shipping section">
      <p className="eyebrow">CUSTOMER CARE</p>
      <h1>
        Shipping <em>policies.</em>
      </h1>
      <p>Complimentary delivery is available on beauty edits over ₹3,000.</p>
      <p>
        Orders are carefully prepared and delivered within 3–5 business days
        across India.
      </p>
      <p>
        Once your order ships, delivery updates will be shared using your
        contact details.
      </p>
      <button className="button dark" onClick={() => setPage("home")}>
        RETURN HOME
      </button>
    </section>
  );
}
function Profile({ user, setUser, setPage }) {
  return (
    <section className="profile section">
      <p className="eyebrow">YOUR ACCOUNT</p>
      <h1>
        Your <em>profile.</em>
      </h1>
      <div className="profile-details">
        <p>
          <b>Name</b>
          <span>{user?.name}</span>
        </p>
        <p>
          <b>Email</b>
          <span>{user?.email}</span>
        </p>
      </div>
      <button
        className="button dark"
        onClick={() => {
          setUser(null);
          setPage("home");
        }}
      >
        LOG OUT
      </button>
    </section>
  );
}
function About({ setPage }) {
  return (
    <section className="story section">
      <p className="eyebrow">ABOUT LUMA</p>
      <h1>
        Beauty shopping.
        <br />
        <em>Minus the headache.</em>
      </h1>
      <p>
        LUMA is your one-stop beauty destination for{" "}
        <b>makeup, skincare, fragrance, haircare & more</b> — because
        apparently, choosing a lipstick wasn’t complicated enough already.
      </p>
      <p>
        We bring your favourite beauty brands, trending products, cult classics,
        and <em>“okay fine, I need this”</em> finds together in one place.
      </p>
      <p>
        No endless scrolling.
        <br />
        No 17 open tabs.
        <br />
        No <em>“where do I even find this?”</em>
      </p>
      <p className="story-close">
        <b>discover. obsess. add to cart.</b>
      </p>
      <h2>About LUMA</h2>
      <p>
        We don’t make the products. <b>We just make finding them way easier.</b>
      </p>
      <p>
        From everyday essentials to your latest beauty obsession, LUMA is here
        to help you discover what’s worth the hype and what absolutely isn’t.
      </p>
      <p>Good beauty. Less chaos. More you.</p>
      <button className="button dark" onClick={() => setPage("home")}>
        RETURN HOME
      </button>
    </section>
  );
}
function Footer({ setPage }) {
  return (
    <footer>
      <div className="footer-logo">LUMA</div>
      <div id="support">
        <h4>Customer Care</h4>
        <a href="tel:7757049860">
          Contact us <span>7757049860</span>
        </a>
        <button
          className="footer-link"
          onClick={() => {
            setPage("shipping");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          Shipping policies
        </button>
      </div>
      <div>
        <h4>About Us</h4>
        <button
          className="footer-link"
          onClick={() => {
            setPage("about");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          Who we are
        </button>
      </div>
      <small>© 2026 LUMA BEAUTY · COLLEGE DEMO E-COMMERCE EXPERIENCE</small>
    </footer>
  );
}
createRoot(document.getElementById("root")).render(<App />);
