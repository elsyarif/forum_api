# forum-api
Submission Proyek Automation Testing dan Clean Architecture 

Kriteria Forum API

Threads Tables:

| column     | type         |
|------------|--------------|
| id         | VARCHAR(50)  |
| title      | VARCHAR(150) |
| body       | TEXT         |
| owner      | VARCHAR(50)  |
| created_at | timestamp    |
| updated_at | timestamp    |

Comments Tables:

| column     | type        |
|------------|-------------|
| id         | VARCHAR(50) |
| thread_id  | VARCHAR(50) |
| content    | TEXT        |
| owner      | VARCHAR(50) |
| is_deleted | BOOLEAN     |
| created_at | timestamp   |
| updated_at | timestamp   |

* Kriteria 1: Menambahkan Thread
* Kriteria 2: Menambahkan Komentar pada Thread
* Kriteria 3: Menghapus Komentar pada Thread
* kriteria 4: Melihat Detail Thread
* Kriteria 5: Menerapkan Automation Testing
* Kriteria 6: Menerapkan Clean Architecture
* Kriteria Optional: Menerapkan Balasan pada Komentar Thread
* Kriteria Optional: Menhapus Balasan pada Komentar Thread
* 
