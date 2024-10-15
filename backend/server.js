import express from "express";
import mysql from "mysql";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());
// Koneksi ke database MySQL
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "bank_sampah",
});

// Tabel Bank Sampah
app.get("/BankSampah", (req, res) => {
  const sql = "SELECT * FROM tb_bank_sampah";
  db.query(sql, (err, result) => {
    if (err) return res.json({ Message: "Error inside server" });
    return res.json(result);
  });
});

app.post("/CreateBankSampah", (req, res) => {
  const sql = "INSERT INTO tb_bank_sampah (`nama_bank_sampah`) VALUES (?)";
  console.log(req.body);
  const values = [req.body.nama_bank_sampah];
  db.query(sql, [values], (err, result) => {
    if (err) return res.json(err);
    return res.json(result);
  });
});

app.get("/ReadBankSampah/:id_bank_sampah", (req, res) => {
  const sql = "SELECT * FROM tb_bank_sampah WHERE id_bank_sampah = ?";
  const id_bank_sampah = req.params.id_bank_sampah;
  db.query(sql, [id_bank_sampah], (err, result) => {
    if (err) return res.json({ Message: "Error inside server" });
    return res.json(result);
  });
});

app.put("/EditBankSampah/:id_bank_sampah", (req, res) => {
  const sql =
    "UPDATE tb_bank_sampah set `nama_bank_sampah`=? WHERE id_bank_sampah=? ";
  const id_bank_sampah = req.params.id_bank_sampah;
  db.query(sql, [req.body.nama_bank_sampah, id_bank_sampah], (err, result) => {
    if (err) return res.json({ Message: "Error inside server" });
    return res.json(result);
  });
});

app.delete("/DeleteBankSampah/:id_bank_sampah", (req, res) => {
  const sql = "DELETE from tb_bank_sampah WHERE id_bank_sampah=?";
  const id_bank_sampah = req.params.id_bank_sampah;
  db.query(sql, [id_bank_sampah], (err, result) => {
    if (err) return res.json({ Message: "Error inside server" });
    return res.json(result);
  });
});

//Tabel Petugas
app.get("/Petugas", (req, res) => {
  const sql = `
    SELECT users.id_user, 
           IF(users.level = 'super admin', NULL, tb_bank_sampah.nama_bank_sampah) AS nama_bank_sampah,
           users.nama, 
           users.username, 
           users.email, 
           users.level 
    FROM users 
    LEFT JOIN tb_bank_sampah ON users.id_bank_sampah = tb_bank_sampah.id_bank_sampah`;

  db.query(sql, (err, result) => {
    if (err) return res.json({ Message: "Error inside server" });
    return res.json(result);
  });
});

app.post("/CreatePetugas", (req, res) => {
  const { nama, username, email, password, level, id_bank_sampah } = req.body;

  // Jika level adalah "Super Admin", atur id_bank_sampah menjadi null
  const idBankSampah = level === "Super Admin" ? null : id_bank_sampah;

  const sql = `
    INSERT INTO users (nama, username, email, password, level, id_bank_sampah) 
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  const values = [nama, username, email, password, level, idBankSampah];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error:", err);
      return res.status(500).json({ message: "Internal server error" });
    }
    return res.status(200).json({ message: "User created successfully" });
  });
});

// Endpoint untuk memeriksa apakah username sudah digunakan
app.get("/CheckUsername/:username", (req, res) => {
  const sql = "SELECT * FROM users WHERE username = ?";
  const username = req.params.username;
  db.query(sql, [username], (err, result) => {
    if (err) return res.status(500).json({ message: "Error inside server" });
    if (result.length > 0) {
      return res.json({ exists: true });
    } else {
      return res.json({ exists: false });
    }
  });
});

app.get("/ReadPetugas/:id_user", (req, res) => {
  const id_user = req.params.id_user;
  const sql = `
    SELECT users.id_user, users.nama, users.username, users.email, users.level, tb_bank_sampah.nama_bank_sampah
    FROM users
    LEFT JOIN tb_bank_sampah ON users.id_bank_sampah = tb_bank_sampah.id_bank_sampah
    WHERE users.id_user = ?
  `;
  db.query(sql, [id_user], (err, result) => {
    if (err) {
      console.log("Error fetching user:", err);
      return res.status(500).json({ message: "Internal server error" });
    }
    if (result.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.json(result[0]);
  });
});

app.put("/EditPetugas/:id_user", (req, res) => {
  const { id_user } = req.params;
  const { nama, username, email, password, level } = req.body;
  const sql = `
    UPDATE users
    SET nama = ?, username = ?, email = ?, password = ?, level = ?
    WHERE id_user = ?
  `;
  db.query(
    sql,
    [nama, username, email, password, level, id_user],
    (err, result) => {
      if (err) {
        console.log("Error updating user:", err);
        return res.status(500).json({ message: "Error inside server" });
      }
      return res.json(result);
    }
  );
});

app.delete("/DeletePetugas/:id_user", (req, res) => {
  const sql = "DELETE from users WHERE id_user=?";
  const id_user = req.params.id_user;
  db.query(sql, [id_user], (err, result) => {
    if (err) return res.json({ Message: "Error inside server" });
    return res.json(result);
  });
});

//Tabel Katagori Sampah
app.get("/KategoriSampah", (req, res) => {
  const { nama_bank_sampah } = req.query;
  let sql = `
    SELECT kategori.id_kategori, kategori.nama_kategori, tb_bank_sampah.nama_bank_sampah
    FROM kategori 
    LEFT JOIN tb_bank_sampah ON kategori.id_bank_sampah = tb_bank_sampah.id_bank_sampah
  `;

  if (nama_bank_sampah) {
    sql += ` WHERE tb_bank_sampah.nama_bank_sampah = ?`;
  }

  db.query(sql, [nama_bank_sampah], (err, result) => {
    if (err) {
      console.error("Database query error:", err);
      return res.status(500).json({ error: "Terjadi kesalahan dalam server" });
    }
    return res.json(result);
  });
});

app.get("/KategoriSampah/:id_bank_sampah", (req, res) => {
  const sql =
    "SELECT kategori.id_kategori, kategori.nama_kategori, tb_bank_sampah.nama_bank_sampah FROM kategori JOIN tb_bank_sampah  ON kategori.id_bank_sampah = tb_bank_sampah.id_bank_sampah where kategori.id_bank_sampah =?";
  const id_bank_sampah = req.params.id_bank_sampah;
  db.query(sql, [id_bank_sampah], (err, result) => {
    if (err) return res.json({ Message: "Error inside server" });
    return res.json(result);
  });
});

app.post("/CreateKategoriSampah", (req, res) => {
  const sql =
    "INSERT INTO kategori (nama_kategori, id_bank_sampah) VALUES (?, ?)";
  const values = [req.body.nama_kategori, req.body.id_bank_sampah];
  db.query(sql, values, (err, result) => {
    if (err) return res.json(err);
    return res.json(result);
  });
});

app.get("/ReadKategoriSampah/:id_kategori", (req, res) => {
  const sql = `
    SELECT jenis.id_jenis, kategori.id_kategori, kategori.nama_kategori, 
           jenis.nama_jenis, jenis.keterangan, jenis.harga, tb_bank_sampah.nama_bank_sampah
    FROM kategori
    INNER JOIN jenis ON jenis.id_kategori = kategori.id_kategori
    INNER JOIN tb_bank_sampah ON kategori.id_bank_sampah = tb_bank_sampah.id_bank_sampah
    WHERE kategori.id_kategori = ?
  `;
  const id_kategori = req.params.id_kategori;
  db.query(sql, [id_kategori], (err, result) => {
    if (err) return res.json({ Message: "Error inside server" });
    return res.json(result);
  });
});

app.put("/EditKategoriSampah/:id_kategori", (req, res) => {
  const sql = "UPDATE kategori set `nama_kategori`=? WHERE id_kategori=?";
  const id_kategori = req.params.id_kategori;
  db.query(sql, [req.body.nama_kategori, id_kategori], (err, result) => {
    if (err) return res.json({ Message: "Error inside server" });
    return res.json(result);
  });
});

app.delete("/DeleteKategoriSampah/:id_kategori", (req, res) => {
  const sql = "DELETE from kategori WHERE id_kategori=?";
  const id_kategori = req.params.id_kategori;
  db.query(sql, [id_kategori], (err, result) => {
    if (err) return res.json({ Message: "Error inside server" });
    return res.json(result);
  });
});

//Tabel Jenis Sampah
app.get("/JenisSampah", (req, res) => {
  const { nama_kategori } = req.query;
  let sql = `
    SELECT jenis.id_jenis, kategori.nama_kategori, jenis.nama_jenis, jenis.keterangan, jenis.harga
    FROM jenis 
    INNER JOIN kategori ON jenis.id_kategori = kategori.id_kategori
  `;

  if (nama_kategori) {
    sql += ` WHERE kategori.nama_kategori = ?`;
  }

  db.query(sql, [nama_kategori], (err, result) => {
    if (err) return res.json({ Message: "Error inside server" });
    return res.json(result);
  });
});

app.post("/CreateJenisSampah", (req, res) => {
  const sql =
    "INSERT INTO jenis (`id_kategori`, `nama_jenis`, `keterangan`, `harga`) VALUES (?)";
  console.log(req.body);
  const values = [
    req.body.id_kategori,
    req.body.nama_jenis,
    req.body.keterangan,
    req.body.harga,
  ];
  db.query(sql, [values], (err, result) => {
    if (err) return res.json(err);
    return res.json(result);
  });
});

app.get("/ReadJenisSampah/:id_jenis", (req, res) => {
  const sql =
    "SELECT jenis.id_jenis, kategori.nama_kategori, jenis.nama_jenis, jenis.keterangan, jenis.keterangan, jenis.harga FROM jenis INNER JOIN kategori ON jenis.id_kategori = kategori.id_kategori WHERE id_jenis = ?";
  const id_jenis = req.params.id_jenis;
  db.query(sql, [id_jenis], (err, result) => {
    if (err) return res.json({ Message: "Error inside server" });
    return res.json(result);
  });
});

app.get("/ReadJenisSampah2/:id_kategori", (req, res) => {
  const sql = "SELECT * FROM jenis WHERE id_kategori = ?";
  const id_kategori = req.params.id_kategori;
  db.query(sql, [id_kategori], (err, result) => {
    if (err) return res.json({ Message: "Error inside server" });
    return res.json(result);
  });
});

app.get("/ReadJenisSampah3/:id_jenis", (req, res) => {
  const sql = "SELECT * FROM jenis WHERE id_jenis = ?";
  const id_jenis = req.params.id_jenis;
  db.query(sql, [id_jenis], (err, result) => {
    if (err) return res.json({ Message: "Error inside server" });
    return res.json(result);
  });
});

app.put("/EditJenisSampah/:id_jenis", (req, res) => {
  const sql =
    "UPDATE jenis set `nama_jenis`=?, `keterangan`=?, `harga`=? WHERE id_jenis=?";
  const id_jenis = req.params.id_jenis;
  db.query(
    sql,
    [req.body.nama_jenis, req.body.keterangan, req.body.harga, id_jenis],
    (err, result) => {
      if (err) return res.json({ Message: "Error inside server" });
      return res.json(result);
    }
  );
});

app.delete("/DeleteJenisSampah/:id_jenis", (req, res) => {
  const sql = "DELETE from jenis WHERE id_jenis=?";
  const id_jenis = req.params.id_jenis;
  db.query(sql, [id_jenis], (err, result) => {
    if (err) return res.json({ Message: "Error inside server" });
    return res.json(result);
  });
});

//tabel laporan
// Endpoint untuk mendapatkan data laporan
app.get("/Laporan", (req, res) => {
  const { id_bank_sampah, user_role, start_date, end_date } = req.query; // Ambil id_bank_sampah, user_role, start_date, end_date dari query string

  let sql = `
    SELECT DISTINCT 
      transaksi.id_transaksi, 
      users.nama AS nama_petugas, 
      transaksi.nama_nasabah, 
      transaksi.tanggal, 
      tb_bank_sampah.nama_bank_sampah,
      transaksi.Total
    FROM transaksi 
    JOIN users ON transaksi.id_user = users.id_user
    JOIN tb_bank_sampah ON users.id_bank_sampah = tb_bank_sampah.id_bank_sampah
  `;

  const params = [];
  if (user_role !== "Super Admin") {
    sql += ` WHERE users.id_bank_sampah = ?`;
    params.push(id_bank_sampah);
  }

  if (start_date && end_date) {
    if (params.length > 0) {
      sql += ` AND transaksi.tanggal BETWEEN ? AND ?`;
    } else {
      sql += ` WHERE transaksi.tanggal BETWEEN ? AND ?`;
    }
    params.push(start_date, end_date);
  }

  db.query(sql, params, (err, result) => {
    if (err) throw err;

    // Menghitung total harga
    const totalHarga = result.reduce(
      (total, transaksi) => total + transaksi.Total,
      0
    );
    res.send({ data: result, totalHarga });
  });
});

app.get("/Laporan/:id_transaksi", (req, res) => {
  const { id_transaksi } = req.params;
  const sql = `
    SELECT 
      detail_transaksi.id_detail, 
      transaksi.id_transaksi,
      users.nama AS nama_petugas, 
      transaksi.nama_nasabah, 
      transaksi.tanggal, 
      detail_transaksi.jumlah,
      detail_transaksi.amount,
      kategori.nama_kategori,
      jenis.nama_jenis,
      transaksi.total
    FROM transaksi 
    INNER JOIN detail_transaksi 
      ON transaksi.id_transaksi = detail_transaksi.id_transaksi
    INNER JOIN kategori
      ON detail_transaksi.id_kategori = kategori.id_kategori
    INNER JOIN jenis
      ON detail_transaksi.id_jenis = jenis.id_jenis
    INNER JOIN users
      ON transaksi.id_user = users.id_user
    WHERE transaksi.id_transaksi = ?
  `;
  db.query(sql, [id_transaksi], (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

//Searching
app.get("/search", (req, res) => {
  const query = req.query.query;

  const sql = `
    SELECT id_bank_sampah AS id, nama_bank_sampah AS nama, 'tb_bank_sampah' AS type FROM tb_bank_sampah WHERE nama_bank_sampah LIKE ? 
    UNION 
    SELECT id_jenis AS id, nama_jenis AS nama, 'jenis' AS type FROM jenis WHERE nama_jenis LIKE ? 
    UNION 
    SELECT id_kategori AS id, nama_kategori AS nama, 'kategori' AS type FROM kategori WHERE nama_kategori LIKE ? 
    UNION 
    SELECT id_user AS id, username AS nama, 'users' AS type FROM users WHERE username LIKE ?`;

  const params = [`%${query}%`, `%${query}%`, `%${query}%`, `%${query}%`];

  db.query(sql, params, (err, result) => {
    if (err) {
      console.error("Error dalam server:", err);
      return res.status(500).json({ message: "Error dalam server" });
    }
    return res.json(result);
  });
});

// Endpoint untuk menghapus data laporan berdasarkan id_transaksi

// joinJenis

app.get("/JoinJenis/:id_bank_sampah", (req, res) => {
  const sql =
    "SELECT kategori.id_kategori, kategori.nama_kategori, jenis.id_jenis, jenis.nama_jenis, jenis.keterangan, jenis.harga, tb_bank_sampah.id_bank_sampah, tb_bank_sampah.nama_bank_sampah from kategori inner join jenis on kategori.id_kategori = jenis.id_kategori inner join tb_bank_sampah on tb_bank_sampah.id_bank_sampah = kategori.id_bank_sampah where kategori.id_bank_sampah=?";
  const id_bank_sampah = req.params.id_bank_sampah;
  db.query(sql, [id_bank_sampah], (err, result) => {
    if (err) return res.json({ Message: "Error inside server" });
    return res.json(result);
  });
});

// Transaksi
// app.get("/Transaksi", (req, res) => {
//   const sql =
//     "SELECT transaksi.id_transaksi, transaksi.id_bank_sampah, transaksi.nama_petugas, transaksi.nama_nasabah, transaksi.tanggal, tb_bank_sampah.nama_bank_sampah, transaksi.Total from transaksi inner join tb_bank_sampah on transaksi.id_bank_sampah = tb_bank_sampah.id_bank_sampah";
//   db.query(sql, (err, result) => {
//     if (err) return res.json({ Message: "Error inside server" });
//     return res.json(result);
//   });
// });

// joinTransaksi
app.get("/JoinTransaksi", (req, res) => {
  const sql =
    "SELECT detail_transaksi.id_detail, detail_transaksi.id_transaksi, tb_bank_sampah.nama_bank_sampah, transaksi.nama_petugas, transaksi.nama_nasabah, kategori.nama_kategori, jenis.nama_jenis, transaksi.tanggal,detail_transaksi.jumlah, jenis.harga, detail_transaksi.amount  from detail_transaksi  inner join transaksi on detail_transaksi.id_transaksi=transaksi.id_transaksi inner join kategori on detail_transaksi.id_kategori = kategori.id_kategori inner join jenis on detail_transaksi.id_jenis = jenis.id_jenis inner join tb_bank_sampah on transaksi.id_bank_sampah = tb_bank_sampah.id_bank_sampah";
  db.query(sql, (err, result) => {
    if (err) return res.json({ Message: "Error inside server" });
    return res.json(result);
  });
});

app.get("/JoinIdTransaksi/:id_transaksi", (req, res) => {
  const sql =
    "SELECT detail_transaksi.id_detail, detail_transaksi.id_transaksi, detail_transaksi.id_kategori, detail_transaksi.id_jenis, detail_transaksi.jumlah, detail_transaksi.jumlah, detail_transaksi.amount, transaksi.id_bank_sampah, transaksi.id_user, transaksi.nama_nasabah, transaksi.tanggal, transaksi.Total, kategori.nama_kategori, jenis.nama_jenis, jenis.keterangan, jenis.harga, tb_bank_sampah.nama_bank_sampah, users.nama, users.username from detail_transaksi inner join transaksi on detail_transaksi.id_transaksi=transaksi.id_transaksi inner join users on users.id_user=transaksi.id_user inner join kategori on detail_transaksi.id_kategori = kategori.id_kategori inner join jenis on detail_transaksi.id_jenis = jenis.id_jenis inner join tb_bank_sampah on transaksi.id_bank_sampah = tb_bank_sampah.id_bank_sampah WHERE transaksi.id_transaksi=?";
  const id_transaksi = req.params.id_transaksi;
  db.query(sql, [id_transaksi], (err, result) => {
    if (err) return res.json({ Message: "Error inside server" });
    return res.json(result);
  });
});

app.delete("/DeleteTransaksi/:id_transaksi", (req, res) => {
  const sql = "DELETE from transaksi WHERE id_transaksi=?";
  const id_transaksi = req.params.id_transaksi;
  db.query(sql, [id_transaksi], (err, result) => {
    if (err) return res.json({ Message: "Error inside server" });
    return res.json(result);
  });
});

app.get("/LprnTransaksi/:id_bank_sampah", (req, res) => {
  const sql =
    "SELECT *, COUNT(*) AS JmlTransaksi, SUM(Total) AS Total_transaksi FROM transaksi INNER JOIN tb_bank_sampah on transaksi.id_bank_sampah = tb_bank_sampah.id_bank_sampah INNER JOIN users on transaksi.id_user = users.id_user where tb_bank_sampah.id_bank_sampah= ? GROUP BY tanggal";
  const id_bank_sampah = req.params.id_bank_sampah;
  db.query(sql, [id_bank_sampah], (err, result) => {
    if (err) return res.json({ Message: "Error inside server" });
    return res.json(result);
  });
});

app.get("/Transaksi/:id_bank_sampah", (req, res) => {
  const sql =
    "SELECT *  from transaksi inner join tb_bank_sampah on transaksi.id_bank_sampah = tb_bank_sampah.id_bank_sampah inner join users on transaksi.id_user = users.id_user where transaksi.id_bank_sampah = ?";
  const id_bank_sampah = req.params.id_bank_sampah;
  db.query(sql, [id_bank_sampah], (err, result) => {
    if (err) return res.json({ Message: "Error inside server" });
    return res.json(result);
  });
});

app.get("/Transaksi1/:id_user", (req, res) => {
  const sql =
    "SELECT * from transaksi inner join tb_bank_sampah on transaksi.id_bank_sampah = tb_bank_sampah.id_bank_sampah inner join users on transaksi.id_user = users.id_user where users.id_user = ?";
  const id_user = req.params.id_user;
  db.query(sql, [id_user], (err, result) => {
    if (err) return res.json({ Message: "Error inside server" });
    return res.json(result);
  });
});
//Create Transaksi
app.post("/CreateTransaksi", (req, res) => {
  const id_bank_sampah = req.body.id_bank_sampah;
  const id_user = req.body.id_user;
  const nama_nasabah = req.body.nama_nasabah;
  const tanggal = req.body.tanggal;

  if (!id_bank_sampah || !id_user || !nama_nasabah || !tanggal) {
    return res.status(400).json({ error: "Semua bidang harus diisi" });
  }

  const sql =
    "INSERT INTO transaksi (id_bank_sampah, id_user, nama_nasabah, tanggal) VALUES (?, ?, ?, ?)";
  const values = [id_bank_sampah, id_user, nama_nasabah, tanggal];

  db.query(sql, values, (err, result) => {
    if (err) return res.json(err);

    const id_transaksi = result.insertId;
    return res.json({ id_transaksi });
  });
});

//Create Detail Transaksi
app.post("/CreateDetailTransaksi", (req, res) => {
  const sql =
    "INSERT INTO detail_transaksi (id_transaksi, id_kategori, id_jenis, jumlah, amount) VALUES ?";

  const data = req.body.data; // Mengambil data dari body
  const values = data.map((item) => [
    item.id_transaksi,
    item.id_kategori,
    item.id_jenis,
    item.jumlah,
    item.amount,
  ]);

  db.query(sql, [values], (err, result) => {
    if (err) return res.json(err);
    return res.json({ result });
  });
});

//jumlah tabel
app.get("/JumlahJenis", (req, res) => {
  const sql = "SELECT COUNT(id_jenis) AS JumlahJenis FROM jenis";
  db.query(sql, (err, result) => {
    if (err) {
      console.error("Error querying database:", err);
      return res.status(500).json({ message: "Error inside server" });
    }
    res.setHeader("Content-Type", "application/json");
    return res.json(result);
  });
});

app.get("/JumlahKategori", (req, res) => {
  const sql = "SELECT COUNT(id_kategori) AS JumlahKategori FROM kategori";
  db.query(sql, (err, result) => {
    if (err) {
      console.error("Error querying database:", err);
      return res.status(500).json({ message: "Error inside server" });
    }
    res.setHeader("Content-Type", "application/json");
    return res.json(result);
  });
});

app.get("/JumlahBankSampah", (req, res) => {
  const sql =
    "SELECT COUNT(id_bank_sampah) AS JumlahBankSampah FROM tb_bank_sampah";
  db.query(sql, (err, result) => {
    if (err) {
      console.error("Error querying data base:", err);
      return res.status(500).json({ message: "Error inside server" });
    }
    res.setHeader("Content-Type", "application/json");
    return res.json(result);
  });
});

app.get("/JumlahLaporanBank", (req, res) => {
  const sql = "SELECT COUNT(id_transaksi) AS JumlahLaporanBank FROM transaksi";
  db.query(sql, (err, result) => {
    if (err) {
      console.error("Error querying database:", err);
      return res.status(500).json({ message: "Error inside server" });
    }
    res.setHeader("Content-Type", "application/json");
    return res.json(result);
  });
});

//grafik laporan Web
app.get("/GrafikLaporan", (req, res) => {
  const sql =
    "SELECT MONTH(tanggal) AS bulan, COUNT(*) AS jumlah_transaksi FROM transaksi GROUP BY bulan;";
  db.query(sql, (err, result) => {
    if (err) {
      console.error("Error querying database:", err);
      return res.status(500).json({ message: "Error inside server" });
    }
    res.setHeader("Content-Type", "application/json");
    return res.json(result);
  });
});

app.get("/Transaksi/:id_bank_sampah", (req, res) => {
  const sql =
    "SELECT transaksi.id_transaksi, transaksi.id_bank_sampah, transaksi.id_user, users.username, transaksi.nama_nasabah, transaksi.tanggal, tb_bank_sampah.nama_bank_sampah, transaksi.Total from transaksi inner join tb_bank_sampah on transaksi.id_bank_sampah = tb_bank_sampah.id_bank_sampah inner join users on transaksi.id_user = users.id_user where transaksi.id_bank_sampah = ?";
  const id_bank_sampah = req.params.id_bank_sampah;
  db.query(sql, [id_bank_sampah], (err, result) => {
    if (err) return res.json({ Message: "Error inside server" });
    return res.json(result);
  });
});

//grafik laporan mobile
app.get("/JmlKategori/:id_bank_sampah", (req, res) => {
  const sql =
    "SELECT detail_transaksi.id_kategori, kategori.nama_kategori, COUNT(*) AS JmlKategori FROM detail_transaksi inner join kategori on detail_transaksi.id_kategori = kategori.id_kategori where kategori.id_bank_sampah = ? GROUP BY id_kategori;";
  const id_bank_sampah = req.params.id_bank_sampah;
  db.query(sql, [id_bank_sampah], (err, result) => {
    if (err) {
      console.error("Error querying database:", err);
      return res.status(500).json({ message: "Error inside server" });
    }
    res.setHeader("Content-Type", "application/json");
    return res.json(result);
  });
});

app.get("/JmlNasabah/:id_bank_sampah", (req, res) => {
  const sql =
    "SELECT tanggal, nama_nasabah, COUNT(*) AS JmlNasabah FROM transaksi where transaksi.id_bank_sampah = ? GROUP BY nama_nasabah, tanggal";
  const id_bank_sampah = req.params.id_bank_sampah;
  db.query(sql, [id_bank_sampah], (err, result) => {
    if (err) {
      console.error("Error querying database:", err);
      return res.status(500).json({ message: "Error inside server" });
    }
    res.setHeader("Content-Type", "application/json");
    return res.json(result);
  });
});
//Login
app.post("/LoginPetugas", (req, res) => {
  const { username, password } = req.body;

  // Lakukan pencarian petugas berdasarkan username
  const sql =
    "SELECT * FROM users inner join tb_bank_sampah on users.id_bank_sampah = tb_bank_sampah.id_bank_sampah WHERE username = ?";
  db.query(sql, [username], (err, result) => {
    if (err)
      return res.status(500).json({ error: "Terjadi kesalahan dalam server" });

    if (result.length === 0) {
      // Jika tidak ditemukan petugas dengan username yang diberikan
      return res.status(400).json({ error: "Username tidak ditemukan" });
    }

    // Verifikasi password
    const user = result[0];
    if (user.password !== password) {
      // Jika password tidak sesuai
      return res.status(401).json({ error: "Password salah" });
    }

    if (user.level !== "Petugas") {
      return res
        .status(403)
        .json({ error: "Anda tidak memiliki izin untuk melakukan login" });
    }

    // Jika username dan password cocok, kirim respons berhasil
    res.status(200).json({ message: "Login berhasil", user });
  });
});

app.post("/Login", (req, res) => {
  const { username, password } = req.body;

  const sql = `
    SELECT users.*, tb_bank_sampah.nama_bank_sampah 
    FROM users 
    LEFT JOIN tb_bank_sampah ON users.id_bank_sampah = tb_bank_sampah.id_bank_sampah 
    WHERE username = ?`;

  db.query(sql, [username], (err, result) => {
    if (err) {
      console.error("Database query error:", err);
      return res.status(500).json({ error: "Terjadi kesalahan dalam server" });
    }

    if (result.length === 0) {
      return res.status(400).json({ error: "Username tidak ditemukan" });
    }

    const user = result[0];
    if (user.password !== password) {
      return res.status(401).json({ error: "Password salah" });
    }

    if (user.level !== "Admin" && user.level !== "Super Admin") {
      return res
        .status(403)
        .json({ error: "Anda tidak memiliki izin untuk melakukan login" });
    }

    res.status(200).json({ message: "Login berhasil", user });
  });
});

app.post("/LoginAdmin", (req, res) => {
  const { username, password } = req.body;

  // Lakukan pencarian petugas berdasarkan username
  const sql =
    "SELECT * FROM users inner join tb_bank_sampah on users.id_bank_sampah = tb_bank_sampah.id_bank_sampah WHERE username = ?";
  db.query(sql, [username], (err, result) => {
    if (err)
      return res.status(500).json({ error: "Terjadi kesalahan dalam server" });

    if (result.length === 0) {
      // Jika tidak ditemukan petugas dengan username yang diberikan
      return res.status(400).json({ error: "Username tidak ditemukan" });
    }

    // Verifikasi password
    const user = result[0];
    if (user.password !== password) {
      // Jika password tidak sesuai
      return res.status(401).json({ error: "Password salah" });
    }

    if (user.level !== "Admin") {
      return res
        .status(403)
        .json({ error: "Anda tidak memiliki izin untuk melakukan login" });
    }

    // Jika username dan password cocok, kirim respons berhasil
    res.status(200).json({ message: "Login berhasil", user });
  });
});

// Tambahkan endpoint baru untuk sign up
app.post("/Signup", (req, res) => {
  const { username, email, password, level } = req.body;

  // Lakukan validasi data
  if (!username || !email || !password || !level) {
    return res.status(400).json({ error: "Semua bidang harus diisi" });
  }

  // Lakukan logika penyimpanan data ke dalam tabel MySQL
  const sql =
    "INSERT INTO users (username, email, password, level) VALUES (?, ?, ?, ?)";
  const values = [username, email, password, level];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error:", err);
      return res.status(500).json({ error: "Gagal membuat akun pengguna" });
    }
    return res.status(201).json({ message: "Sign up berhasil" });
  });
});

app.listen(8081, () => {
  console.log("Listening");
});
