
function fiveSecs(err, res) {
  console.error(err)

  if (err.code === 11000) {
    return res.send(`
      <div style="font-family: Arial; text-align: center; padding-top: 100px;">
        <h2 style="color:red;">User Already Exists.</h2>
        <p>Redirecting to Login...</p>
        <script>
          setTimeout(() => {
            window.location.href = '/auth/login';
          }, 5000);
        </script>
      </div>
    `)
  }
}

module.exports = fiveSecs
