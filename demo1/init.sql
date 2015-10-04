use test;
create table user(
  id int(11) auto_increment primary key,
  name varchar(32),
  age int(3)
);

select * from user;

insert into user(`name`, `age`)
values ('John Doe', 25);